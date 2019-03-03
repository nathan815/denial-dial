const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Load env variables from .env file
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const phoneService = require('./services/phone');
const reciverService = require('./services/reciever');

require('./db/connect');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle twilio received messages
app.post('/sms', (req, res, next) => {
    try {
        reciverService.receivedMessage(req.body);
    } catch(err) {
        next(err);
    }
    res.status(200);
    res.send(new MessagingResponse().toString());
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Now listening on ' + port);
});

// Start the phone random assignment runner
phoneService.phoneAssignmentRunner();