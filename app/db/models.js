const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sid: String,
    sentAt: String,
    to: String,
    from: String,
    body: String,
}, { timestamps: true });
const Message = mongoose.model('Message', messageSchema);


const phoneSchema = new mongoose.Schema({
    number: { type: String, index: true, unique: true },
    pairedPhone: { type: mongoose.Schema.ObjectId, ref: 'PhoneNumber' },
    sentMessageCount: 0
}, { timestamps: true });
const PhoneNumber = mongoose.model('PhoneNumber', phoneSchema);


const phonePairSchema = new mongoose.Schema({
    phones: phoneSchema,
    phone2: phoneSchema,
});
const PhonePair = mongoose.model('PhonePair', phonePairSchema);

module.exports = {
    Message, PhoneNumber, PhonePair
};