//services
commentService = require('../services/CommentService');

module.exports.listen = (io) => {
    io.of('/comment').on('connection', (socket) => {
        socket.on('setRoom', (room) => {
            socket.join(room);
          });

        socket.on('comment', async (comment) => {
            await commentService.addComment(comment);
            io.of('/comment').in(comment.postId).emit('comment-broadcast', comment);
        });

    });
}
