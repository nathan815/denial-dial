const twilioService = require('./twilio');
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

            const pairedPhone = await phoneService.getPairedPhone(message.from);

            if (!pairedPhone) {
                phoneService.insertPhoneNumber(message.from);
            } 
            else {
                twilioService.sendText({
                    body: message.body,
                    to: pairedPhone.number
                });
            }
        } catch (err) {
            console.error('Error on receiving message', message, err);
        }

    },
};