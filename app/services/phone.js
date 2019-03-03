const { PhoneNumber, PhonePair } = require('../db/models');

module.exports = {

    async getPairedPhone(phoneNumber) {
        const phone = await PhoneNumber.findOne({
            number: phoneNumber
        });
        return phone.pairedPhone;
    },

}