class PostDTO {
    constructor(email, description, pictureURL, timestamp) {
        this.email = email;
        this.description = description;
        this.pictureURL = pictureURL;
        this.timestamp = timestamp;
    }
}

module.exports = PostDTO;