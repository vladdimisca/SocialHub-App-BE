const messagesService = require('../dao/MessageDAO');

module.exports.sendMessage = async (message) => {
    await messagesService.sendMessage(message);
}

module.exports.getAllMessages = async (chatId) => {
    return await messagesService.getAllMessages(chatId);
}
