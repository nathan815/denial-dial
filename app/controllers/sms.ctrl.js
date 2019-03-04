const MessagingResponse = require('twilio').twiml.MessagingResponse;
const receiverService = require('../services/reciever');

module.exports = (req, res, next) => {
    try {
        receiverService.receivedMessage(req.body);
    } catch (err) {
        next(err);
    }
    res.status(200);
    res.send(new MessagingResponse().toString());
};