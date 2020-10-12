const Config = require('../env/Config');
const MessageDTO = require('../dto/MessageDTO');
const admin = require('../../app/utils/dbUtil');
const chatsRef = admin.firestore().collection(Config.chatsCollection); 
const connectionsRef = admin.firestore().collection(Config.connectionsCollection);

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
        lastMessageTimestamp: message.timestamp,
        seen: message.seen
    });

    await connectionsRef.doc(message.receiver).collection('connections').doc(message.sender).set({
        lastMessageTimestamp: message.timestamp,
        seen: true
    });
}

module.exports.seenMessage = async (chatId, messageId, sender, receiver, timestamp) => {
    await chatsRef.doc(chatId).collection('messages').doc(messageId).update({
        seen: true
    });

    const lastMessageTimestamp = await (await connectionsRef.doc(sender).collection('connections').doc(receiver).get()).data().lastMessageTimestamp;

    if(timestamp === lastMessageTimestamp) {
        await connectionsRef.doc(sender).collection('connections').doc(receiver).update({
            seen: true
        });

        return true;
    }

    return false;
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

module.exports.checkUnseenMessages = async (sender, receiver) => {
    return await (await connectionsRef.doc(receiver).collection('connections').doc(sender).get()).data().seen;
}