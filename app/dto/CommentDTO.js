class CommentDTO {
    constructor(commentId, postId, senderEmail, text, timestamp) {
        this.commentId = commentId;
        this.postId = postId;
        this.senderEmail = senderEmail;
        this.text = text;
        this.timestamp = timestamp;
    }
}

module.exports = CommentDTO;
