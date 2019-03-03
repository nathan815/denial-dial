const moment = require('moment');
const { PhoneNumber } = require('../db/models');
const messageService = require('./message');
const sleep = require('../utils/sleep');

module.exports = {

    async getPhone(phoneNumber) {
        const phone = await PhoneNumber.findOne({
            number: phoneNumber
        });
        return phone;
    },

    /**
     * Continually assigns phones
     */
    async phoneAssignmentRunner() {
        console.log('-- phoneAssignmentRunner --');

        await this.assignReadyPhones();

        await sleep(10 * 1000);

        this.phoneAssignmentRunner();
    },

    /**
     * Queries for unpaired phones who first texted at least 30 mins ago
     */
    async getPhonesReadyToText() {
        const result = await PhoneNumber.find({
            pairedPhone: { $exists: false },
            completed: { $ne: true },
            // createdAt: {
            //     $lte: moment().subtract(30, 'minutes').toDate()
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

            const randomIndex = Math.floor(Math.random() * (availablePhones.length - 1));
            const randomPhone = availablePhones[randomIndex];

            // If no more phones are available to pair
            // then send this number the final message
            if (!randomPhone) {
                await messageService.sendFinalMessage(phone.number);
                await this.markPhoneNumberCompleted(phone.number);
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
            number: phoneNumber,
            completed: false
        });
    },

    markPhoneNumberCompleted(phoneNumber) {
        try {
            return PhoneNumber.updateOne({ number: phoneNumber }, {
                completed: true
            });
        } catch (err) {
            console.log(err);
        }
    },

}