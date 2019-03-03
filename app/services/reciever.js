const twilioService = require('./twilio');
const messageService = require('./message');
const phoneService = require('./phone');

module.exports = {
    async receivedMessage(messageData) {
        console.log('Received message ', messageData.sid);

        try {
            const message = await messageService.createMessage(messageData, true);

            const pairedPhone = await phoneService.getPairedPhone(message.from);

            // If the phone isn't paired then queue them up
            if (pairedPhone === null) {
                // TODO
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