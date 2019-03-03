const { Message } = require('../db/models');

module.exports = {
    async createMessage(message, checkIfExists = false) {
        if(checkIfExists) {
            const msg = await Message.findOne({
                id: message.sid
            }).exec();
            if(msg) {
                return false;
            }
        }
        console.log('Creating message record', message)
        return Message.create({
            id: message.sid,
            from: message.from,
            body: message.body
        });
    },
}