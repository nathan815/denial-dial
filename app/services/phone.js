const moment = require('moment');
const { PhoneNumber } = require('../db/models');
const messageService = require('./message');
const callService = require('./call');
const sleep = require('../utils/sleep');

const SLEEP_MS = 10 * 1000;

module.exports = {

    async getPhone(phoneNumber) {
        const phone = await PhoneNumber.findOne({
            number: phoneNumber
        }).populate('pairedPhone');
        return phone;
    },

    /**
     * Continually assigns ready phones
     * 
     * A phone is ready to be replied to and paired after 
     */
    async phoneAssignmentRunner() {
        //console.log('-- phoneAssignmentRunner --');

        await this.assignReadyPhones();

        await sleep(SLEEP_MS);

        this.phoneAssignmentRunner();
    },

    /**
     * Queries for unpaired phones who first texted at least 30 mins ago
     */
    async getPhonesReadyToText() {
        const result = await PhoneNumber.find({
            pairedPhone: { $exists: false },
            // createdAt: {
            //     $lte: moment().subtract(15, 'seconds').toDate()
            // }
        }).exec();
        return result;
    },

    /**
     * Randomly assigns each phone that is ready to another phone
     * 
     */
    async assignReadyPhones() {
        const phones = await this.getPhonesReadyToText();

        if (!phones || phones.length == 0) {
            return;
        }

        console.log('phones', phones);
        const availablePhones = phones.slice(); // shallow copy to track phones not yet paired

        for (let [index, phone] of phones.entries()) {
            delete availablePhones[index];

            const randomIndex = Math.floor(Math.random() * availablePhones.length);
            const randomPhone = availablePhones[randomIndex];

            if (!randomPhone) {
                // only send the final message and remove the number after some time
                if (moment(phone.createdAt).add(2, 'minutes') < moment.now()) {
                    await messageService.sendFinalMessage(phone.number);
                    await callService.makeCall(phone.number);
                    await this.removePhoneNumber(phone.number);
                }
                return;
            }

            delete availablePhones[randomIndex];

            phone.pairedPhone = randomPhone._id;
            randomPhone.pairedPhone = phone._id;

            await Promise.all([
                phone.save(),
                randomPhone.save(),
                messageService.send({
                    to: phone.number,
                    body: "Hey!"
                }),
                messageService.send({
                    to: randomPhone.number,
                    body: "Hey!"
                })
            ]);

        }
    },

    savePhoneNumber(phoneNumber) {
        console.log('Saving phone number ', phoneNumber);
        return PhoneNumber.create({
            number: phoneNumber
        });
    },

    removePhoneNumber(phoneNumber) {
        try {
            return PhoneNumber.findOneAndRemove({
                number: phoneNumber
            });
        } catch (err) {
            console.log(err);
        }
    },

}