const CommentDAO = require('../dao/CommentDAO');

module.exports.addComment = async (comment) => {
    await CommentDAO.addComment(comment);
}

module.exports.getCommentsByPostId = async (postId) => {
    return await CommentDAO.getCommentsByPostId(postId);
}