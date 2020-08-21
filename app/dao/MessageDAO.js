const MessageDTO = require('../dto/MessageDTO');
const userService = require('../services/UserService');
const db = require('../../app/utils/dbUtil');
const chatsRef = db.collection('chats'); 

module.exports.sendMessage = async (message) => {
    const chatId = message.chatId;
    
    await chatsRef.doc(chatId).collection('messages').add({
        sender: message.sender,
        receiver: message.receiver,
        message: message.message,
        timestamp: message.timestamp
    });
}

module.exports.getAllMessages = async (chatId) => {
    let messages = await chatsRef.doc(chatId).collection('messages').orderBy('timestamp').get();
    
    let messagesArray = [];

    messages.forEach(message => {
        message = message.data();
        messagesArray.push(new MessageDTO(message.sender, message.receiver, message.message, message.timestamp));
    })
    
    return messagesArray;
}