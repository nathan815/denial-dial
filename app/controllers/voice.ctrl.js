const VoiceResponse = require('twilio').twiml.VoiceResponse;

const text = `Welcome to the rejection hotline! Someone gave you this number because you didn't get the hint that they're not into you. Next time be more aware and respectful.`;

module.exports = (req, res) => {
    const response = new VoiceResponse();
    response.say(text);

    res.status(200).header('Content-Type', 'text/xml');
    res.send(response.toString());
};