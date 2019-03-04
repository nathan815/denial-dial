const { Message } = require('../db/models');
const client = require('../twilio');

module.exports = {
    async createMessage(message, checkIfExists = false) {
        if(checkIfExists) {
            const msg = await Message.findOne({
                sid: message.sid
            }).exec();
            if(msg) {
                return false;
            }
        }
        console.log('Creating message document', message)
        try {
            return Message.create({
                sid: message.sid,
                from: message.from,
                body: message.body
            });
        } catch(err) {
            console.log(err);
        }
    },

    async sendFinalMessage(number) {
        console.log('send final message');
        return await this.send({
            to: number,
            body: "Welcome to the rejection hotline! Someone gave you this number because you didn't get the hint that they're not into you. Next time be more aware and respectful."
        });
    },

    /**
     * Sends a message
     * 
     * @param {object} messageData { body: String, to: String }
     */
    async send(messageData) {
        messageData['from'] = process.env.TWILIO_PHONE_NUMBER;
        console.log(messageData);
        const message = await client.messages.create(messageData);
        return this.createMessage(messageData);
    },
}