class PostDTO {
    constructor(postId, email, description, pictureURL, timestamp) {
        this.postId = postId
        this.email = email;
        this.description = description;
        this.pictureURL = pictureURL;
        this.timestamp = timestamp;
    }
}

module.exports = PostDTO;