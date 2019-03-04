const { TWILIO_ID, TWILIO_TOKEN } = process.env;
const twilio = require('twilio');
const client = twilio(TWILIO_ID, TWILIO_TOKEN);
module.exports = client;