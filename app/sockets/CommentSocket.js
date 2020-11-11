const { AvailablePhoneNumberCountryList } = require('twilio/lib/rest/api/v2010/account/availablePhoneNumber');

//services
commentService = require('../services/CommentService');
likeService = require ('../services/LikeService');

module.exports.listen = (io) => {
    io.of('/comment').on('connection', (socket) => {
        socket.on('setRoom', (room) => {
            socket.join(room);
          });

        socket.on('comment', async (comment) => {
            await commentService.addComment(comment);
            io.of('/comment').in(comment.postId).emit('comment-broadcast', comment);
        });

        socket.on('delete-comment', async (commentId, postId) => {
            await commentService.deleteComment(commentId);
            io.of('/comment').in(postId).emit('delete-comment-broadcast', commentId, postId);
        });

        socket.on('like', async(postId, email) => {
            await likeService.addLike(postId, email);
            io.of('/comment').in(postId).emit('like-broadcast', postId, email);
        });

        socket.on('dislike', async(postId, email) => {
            await likeService.dislike(postId, email);
            io.of('/comment').in(postId).emit('dislike-broadcast', postId, email);
        })
    });
}
 