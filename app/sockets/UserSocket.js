const users = new Set();

module.exports.listen = (io) => {
    io.of('user-status').on('connection', (socket) => {
        socket.on('newOnlineUser', (email) => {
            users.add(email);
            
            io.of('user-status').emit('onlineUser', email);
        });

        socket.on('getOnlineUsers', () => {
            socket.emit('onlineUsers', Array.from(users));
        });

        socket.on('setUserOffline', (email) => {
            users.delete(email);
            
            io.of('user-status').emit('offlineUser', email);
        });
    });
}