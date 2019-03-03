const { TWILIO_ID, TWILIO_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const { Message } = require('../db/models');
const twilio = require('twilio');
const client = twilio(TWILIO_ID, TWILIO_TOKEN);

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
        return Message.create({
            sid: message.sid,
            from: message.from,
            body: message.body,
            completed: false
        });
    },

    async sendFinalMessage(number) {
        console.log('send final message');
        return await this.send({
            to: number,
            body: "Rejection Hotline!"
        });
    },

    /**
     * Sends a message
     * 
     * @param {object} messageData { body: String, to: String }
     */
    async send(messageData) {
        messageData['from'] = TWILIO_PHONE_NUMBER;
        console.log(messageData);
        const message = await client.messages.create(messageData);
        return this.createMessage(messageData);
    },
}