const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env variables from .env file
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const reciverService = require('./services/reciever');

const app = express();

const { DB_NAME, DB_PORT, DB_USER, DB_PASS } = process.env;
try {
    mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true });
} catch(err) {
    console.error('Unable to connect to database!', err);
}

// Handle twilio received messages
app.post('/sms', (req, res, next) => {
    try {
        reciverService.receivedMessage(req.body);
    } catch(err) {
        next(err);
    }
    res.status(200);
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Now listening on ' + port);
});