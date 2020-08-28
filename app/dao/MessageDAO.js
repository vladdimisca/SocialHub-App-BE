const MessageDTO = require('../dto/MessageDTO');
const userService = require('../services/UserService');
const db = require('../../app/utils/dbUtil');
const chatsRef = db.collection('chats'); 

module.exports.sendMessage = async (message) => {
    const chatId = message.chatId;
    
    const messageDetails = await chatsRef.doc(chatId).collection('messages').add({
        sender: message.sender,
        receiver: message.receiver,
        message: message.message,
        timestamp: message.timestamp,
        seen: message.seen 
    });

    message.messageId = messageDetails.id;
}

module.exports.seenMessage = async (chatId, messageId) => {
    await chatsRef.doc(chatId).collection('messages').doc(messageId).update({
        seen: true
    })
}

module.exports.getAllMessages = async (chatId) => {
    let messages = await chatsRef.doc(chatId).collection('messages').orderBy('timestamp').get();
    
    let messagesArray = [];

    messages.forEach(message => {
        const messageId = message.id;
        message = message.data();
        messagesArray.push(new MessageDTO(messageId, message.sender, message.receiver, message.message, message.timestamp, message.seen));
    })
    
    return messagesArray;
}