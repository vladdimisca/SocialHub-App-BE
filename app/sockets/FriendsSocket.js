// services
const userService = require('../services/UserService');

module.exports.listen = (io) => {
    io.of('friends').on('connection', (socket) => {
        socket.on('join', (user) => {
            socket.join(user);
        });

        socket.on('sendRequest', async (sender, receiver) => {
            await userService.sendFriendRequest(sender, receiver);

            socket.to(receiver).emit('requestReceived', sender);
            io.of('friends').in(sender).emit('requestSent', receiver);
        });

        socket.on('acceptRequest', async (sender, receiver) => {
            await userService.acceptFriendRequest(sender, receiver);

            io.of('friends').in(sender).emit('requestAccepted', receiver);
            socket.to(receiver).emit('requestAccepted', sender);
        });

        socket.on('unfriendRequest', async (sender, receiver) => {
            await userService.removeFriend(sender, receiver);

            io.of('friends').in(sender).emit('unfriendSent', receiver);
            socket.to(receiver).emit('unfriendReceived', sender);
        });

        socket.on('unsendFriendRequest', async (sender, receiver) => {
            await userService.unsendFriendRequest(sender, receiver);

            io.of('friends').in(sender).emit('requestUnsent', receiver);
            io.of('friends').in(receiver).emit('requestWithdrawn', sender);
        });
    });
}