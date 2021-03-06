const mongoose = require('mongoose');

const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;
try {
    mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true });
} catch(err) {
    console.error('Unable to connect to database!', err);
}