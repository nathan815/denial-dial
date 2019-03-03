const messageService = require('./message');
const phoneService = require('./phone');

module.exports = {
    async receivedMessage(messageData) {
        console.log('Received message ', messageData.MessageSid);

        let message;
        try {
            message = await messageService.createMessage({
                sid: messageData.MessageSid,
                from: messageData.From,
                body: messageData.Body
            }, true);

            const phone = await phoneService.getPhone(message.from);

            // if this phone number hasn't been saved yet
            if (!phone) {
                await phoneService.savePhoneNumber(message.from);
            }
            // if phone is paired then forward it to the paired phone
            else if (phone.pairedPhone) {
                await messageService.send({
                    body: message.body,
                    to: phone.pairedPhone.number
                });
            }
        } catch (err) {
            console.error('Error on receiving message', message, err);
        }

    },
};