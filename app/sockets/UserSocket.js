const users = new Set();

module.exports.listen = (io) => {
    io.of('user-status').on('connection', (socket) => {
        socket.on('online', (email) => {
            users.add(email);
            
            socket.broadcast.emit('users', Array.from(users));
        })

        socket.on('getOnlineUsers', () => {
            socket.emit('users', Array.from(users));
        })

        socket.on('disconnect', (email) => {
            users.delete(email);
        })
    });
}