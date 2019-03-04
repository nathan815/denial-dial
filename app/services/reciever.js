const messageService = require('./message');
const phoneService = require('./phone');
const callService = require('./call');

const MESSAGE_THRESHOLD = 3;

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
                phone.sentMessageCount = phone.sentMessageCount ? phone.sentMessageCount + 1 : 1;

                await Promise.all([
                    phone.save(),
                    messageService.send({
                        body: message.body,
                        to: phone.pairedPhone.number
                    })
                ]);

                console.log('count', phone.sentMessageCount);

                // once this phone has sent more than 3 texts, text them
                if (phone.sentMessageCount == MESSAGE_THRESHOLD) {
                    await messageService.sendFinalMessage(phone.number);
                    await callService.makeCall(phone.number);
                }

                if (phone.sentMessageCount >= MESSAGE_THRESHOLD 
                    && phone.pairedPhone.sentMessageCount >= MESSAGE_THRESHOLD) {
                    await phoneService.removePhoneNumber(phone.number);
                    await phoneService.removePhoneNumber(phone.pairedPhone.number);
                }
            }
        } catch (err) {
            console.error('Error on receiving message', message, err);
        }

    },
};