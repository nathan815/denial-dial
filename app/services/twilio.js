const { TWILIO_ID, TWILIO_TOKEN } = process.env;

const twilio = require('twilio');
const client = twilio(TWILIO_ID, TWILIO_TOKEN);
const { Message } = require('../db/models');
const messageService = require('../services/message');

const fromNumber = process.env.TWILIO_NUMBER;

module.exports = {

    /**
     * Sends a message
     * 
     * @param {object} message { body: String, to: String }
     */
    async sendText(message) {
        message['from'] = fromNumber;
        const message = await client.messages.create(message);
        return messageService.createMessage(message);
    }

};