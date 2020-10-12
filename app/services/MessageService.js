const messageDAO = require('../dao/MessageDAO');

module.exports.sendMessage = async (message) => {
    await messageDAO.sendMessage(message);
}

module.exports.seenMessage = async (chatId, messageId, sender, receiver, timestamp) => {
    return await messageDAO.seenMessage(chatId, messageId, sender, receiver,timestamp);
}

module.exports.getAllMessagesByChat = async (chatId) => {
    return await messageDAO.getAllMessagesByChat(chatId);
}

module.exports.checkUnseenMessages = async (sender, receiver) => {
    return await messageDAO.checkUnseenMessages(sender, receiver);
}