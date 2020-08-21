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

          socket.to(message.chatId).emit('message-broadcast', message);
        })

        socket.on('type', async (chatId, email) => {
          const user = await userService.getUserByEmail(email);

          socket.to(chatId).emit('typing', user.firstName);
        })

        socket.on('noLongerTyping', (chatId) => {
          socket.to(chatId).emit('stopTyping');
        })
    });
}
