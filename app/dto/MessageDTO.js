class MessageDTO {
    constructor(messageId, sender, receiver, message, timestamp, seen) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.timestamp = timestamp;
        this.seen = seen;
    }
}

module.exports = MessageDTO;