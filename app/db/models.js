const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    sentAt: String,
    to: String,
    from: String,
    body: String,
});
const Message = mongoose.model('Message', messageSchema,
    { timestamps: true });


const phoneSchema = new mongoose.Schema({
    number: { type: String, index: true, unique: true },
    pairedPhone: mongoose.Schema.ObjectId
});
const PhoneNumber = mongoose.model('PhoneNumber', phoneSchema,
    { timestamps: true });


const phonePairSchema = new mongoose.Schema({
    phones: phoneSchema,
    phone2: phoneSchema,
});
const PhonePair = mongoose.model('PhonePair', phonePairSchema);

module.exports = {
    Message, PhoneNumber, PhonePair
};