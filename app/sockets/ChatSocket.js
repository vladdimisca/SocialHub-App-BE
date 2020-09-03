const messageService = require('../services/MessagesService');
const userService = require('../services/UserService');

module.exports.listen = (io) => {
    io.of('/chat').on('connection', (socket) => {
        socket.on('setRoom', (room) => {
          socket.join(room);
        })

        socket.on('message', async (message) => {
          await messageService.sendMessage(message);
          io.of('/chat').in(message.chatId).emit('message-broadcast', message);
        })

        socket.on('type', async (chatId, email, receiverEmail) => {
          const user = await userService.getUserByEmail(email);

          io.of('/chat').in(chatId).emit('typing', receiverEmail, user.firstName);
        })

        socket.on('noLongerTyping', (chatId) => {
          io.of('/chat').in(chatId).emit('stopTyping');
        })

        socket.on('seenMessage', async (chatId, messageId) => {
          await messageService.seenMessage(chatId, messageId);
          socket.to(chatId).emit('seen', messageId);
        })
    });
}
