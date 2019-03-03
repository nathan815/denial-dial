const moment = require('moment');
const { PhoneNumber, PhonePair } = require('../db/models');
const twilioService = require('./twilio');

module.exports = {

    async getPairedPhone(phoneNumber) {
        const phone = await PhoneNumber.findOne({
            number: phoneNumber
        });
        return phone ? phone.pairedPhone : null;
    },

    /**
     * Returns a cursor to query of phones who first texted at least 30 mins ago
     */
    async getPhonesReadyToText() {
        const cursor = PhoneNumber.find({
            _id: { $ne: phone._id },
            pairedPhone: { $exists: false },
            createdAt: {
                $lte: moment().subtract(30, 'minutes').toDate()
            }
        });
        return cursor;
    },

    /**
     * Assigns phones who are ready to text to other phones randomly
     */
    async assignReadyPhones() {
        const phones = this.getPhonesReadyToText().toArray();

        phones.forEach((phone, i) => {
            if(!phone) return;
            const randomIndex = Math.floor(Math.random() * (phones.length-1));
            const randomPhone = phones[randomIndex];

            phone.pairedPhone = randomPhone._id;
            randomPhone.pairedPhone = phone._id;

            await Promise.all([
                phone.save(),
                randomPhone.save(),
                twilioService.sendText({
                    to: phone.number,
                    body: "Hey!"
                }),
                twilioService.sendText({
                    to: randomPhone.number,
                    body: "Hey!"
                })
            ]);
            
            delete phones[i];
            delete phones[randomIndex];
        });
    },

    insertPhoneNumber(phoneNumber) {
        return PhoneNumber.create({
            number: phoneNumber
        });
    },

    removePhoneNumber(phoneNumber) {
        return PhoneNumber.findOneAndRemove({
            number: phoneNumber
        });
    },

}