const client = require('../twilio');

module.exports = {
    makeCall(number) {
        console.log('calling ', number);
        client.calls
            .create({
                url: `http://936a1802.ngrok.io/voice.xml`,
                to: number,
                from: process.env.TWILIO_PHONE_NUMBER,
            })
            .then(call => process.stdout.write(call.sid));

    }
};