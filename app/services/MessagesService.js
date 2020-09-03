const messageDAO = require('../dao/MessageDAO');

module.exports.sendMessage = async (message) => {
    await messageDAO.sendMessage(message);
}

module.exports.seenMessage = async (chatId, messageId) => {
    await messageDAO.seenMessage(chatId, messageId);
}

module.exports.getAllMessagesByChat = async (chatId) => {
    return await messageDAO.getAllMessagesByChat(chatId);
}
