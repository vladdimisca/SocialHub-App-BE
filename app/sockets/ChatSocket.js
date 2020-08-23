const socketIO = require('socket.io');
const messageService = require('../services/MessagesService');
const userService = require('../services/UserService');

module.exports.listen = (server) => {
    const io = socketIO(server);

    io.of('/chat').on('connection', (socket) => {
        socket.on('setRoom', (room) => {
          socket.join(room);
        })

        socket.on('message', (message) => {
          messageService.sendMessage(message);

          io.of('/chat').in(message.chatId).emit('message-broadcast', message);
        })

        socket.on('type', async (chatId, email, receiverEmail) => {
          const user = await userService.getUserByEmail(email);

          io.of('/chat').in(chatId).emit('typing', receiverEmail, user.firstName);
        })

        socket.on('noLongerTyping', (chatId) => {
          io.of('/chat').in(chatId).emit('stopTyping');
        })
    });
}
