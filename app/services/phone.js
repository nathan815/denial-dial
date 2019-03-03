const { PhoneNumber, PhonePair } = require('../db/models');

module.exports = {

    async getPairedPhone(phoneNumber) {
        const phone = await PhoneNumber.findOne({
            number: phoneNumber
        });
        return phone ? phone.pairedPhone : null;
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