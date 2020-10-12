// services
const friendsService = require('../services/FriendsService');

module.exports.listen = (io) => {
    io.of('friends').on('connection', (socket) => {
        socket.on('join', (user) => {
            socket.join(user);
        });

        socket.on('sendRequest', async (sender, receiver) => {
            await friendsService.sendFriendRequest(sender, receiver);

            socket.to(receiver).emit('requestReceived', sender);
            io.of('friends').in(sender).emit('requestSent', receiver);
        });

        socket.on('acceptRequest', async (sender, receiver) => {
            await friendsService.acceptFriendRequest(sender, receiver);

            io.of('friends').in(sender).emit('requestAccepted', receiver);
            socket.to(receiver).emit('requestAccepted', sender);
        });

        socket.on('unfriendRequest', async (sender, receiver) => {
            await friendsService.removeFriend(sender, receiver);

            io.of('friends').in(sender).emit('unfriendSent', receiver);
            socket.to(receiver).emit('unfriendReceived', sender);
        });

        socket.on('unsendFriendRequest', async (sender, receiver) => {
            await friendsService.unsendFriendRequest(sender, receiver);

            io.of('friends').in(sender).emit('requestUnsent', receiver);
            io.of('friends').in(receiver).emit('requestWithdrawn', sender);
        });
    });
}