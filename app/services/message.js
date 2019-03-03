const { TWILIO_ID, TWILIO_TOKEN } = process.env;
const { Message } = require('../db/models');
const twilio = require('twilio');
const client = twilio(TWILIO_ID, TWILIO_TOKEN);

module.exports = {
    async createMessage(message, checkIfExists = false) {
        if(checkIfExists) {
            const msg = await Message.findOne({
                id: message.sid
            }).exec();
            if(msg) {
                return false;
            }
        }
        console.log('Creating message document')
        return Message.create({
            id: message.sid,
            from: message.from,
            body: message.body
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
     * @param {object} message { body: String, to: String }
     */
    async send(message) {
        const fromNumber = process.env.TWILIO_NUMBER;
        message['from'] = fromNumber;
        const message = await client.messages.create(message);
        return this.createMessage(message);
    },
}