const MessageDTO = require('../dto/MessageDTO');
const userService = require('../services/UserService');
const db = require('../../app/utils/dbUtil');
const { use } = require('../controllers/UserController');
const chatsRef = db.collection('chats'); 
const connectionsRef = db.collection('user-connections');

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

    await connectionsRef.doc(message.sender).collection('connections').doc(message.receiver).set({
        lastMessageTimestamp: message.timestamp
    });

    await connectionsRef.doc(message.receiver).collection('connections').doc(message.sender).set({
        lastMessageTimestamp: message.timestamp
    });
}

module.exports.seenMessage = async (chatId, messageId) => {
    await chatsRef.doc(chatId).collection('messages').doc(messageId).update({
        seen: true
    })
}

module.exports.getAllMessagesByChat = async (chatId) => {
    let messages = await chatsRef.doc(chatId).collection('messages').orderBy('timestamp').get();
    
    let messagesArray = [];

    messages.forEach(message => {
        const messageId = message.id;
        message = message.data();
        messagesArray.push(new MessageDTO(messageId, message.sender, message.receiver, message.message, message.timestamp, message.seen));
    })
    
    return messagesArray;
}