const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load env variables from .env file
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

require('./db/connect');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../public'))

app.get('/voice.xml', require('./controllers/voice.ctrl'));
app.post('/sms', require('./controllers/sms.ctrl'));

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Now listening on ' + port);
});

// Start the phone random assignment runner
require('./services/phone').phoneAssignmentRunner();