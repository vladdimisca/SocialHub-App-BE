class MessageDTO {
    constructor(sender, receiver, message, timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.timestamp = timestamp;
    }
}

module.exports = MessageDTO;