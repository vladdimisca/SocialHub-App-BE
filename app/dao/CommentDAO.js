const Config = require('../env/Config');
const admin = require('../../app/utils/dbUtil');
const commentsRef = admin.firestore().collection(Config.commentsCollection);
const CommentDTO = require ('../dto/CommentDTO');

module.exports.addComment = async (comment) => {
    commentsRef.doc().set ({
        postId: comment.postId,
        senderEmail: comment.senderEmail,
        text: comment.text,
        timestamp: comment.timestamp
    });
}

module.exports.getCommentsByPostId = async (postId) => {
    const comments = await commentsRef.where('postId', '==', postId).get();

    const commentsArray = [];

    comments.forEach(comment => {
        const commentId = comment.id;
        comment = comment.data();
        commentsArray.push(new CommentDTO(commentId, comment.postId, comment.senderEmail, comment.text, comment.timestamp));
    });

    return commentsArray;   
}

module.exports.deleteComment = async (commentId) => {
    await commentsRef.doc(commentId).delete();
}