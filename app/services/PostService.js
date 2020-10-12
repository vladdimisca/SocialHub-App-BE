const postDAO = require('../dao/PostDAO');

module.exports.addPost = async (email, description, image, timestamp) => {
    return await postDAO.addPost(email, description, image, timestamp);
}

module.exports.getPostsByEmail = async (email) => {
    return await postDAO.getPostsByEmail(email);
}

module.exports.getFriendsPostsByEmail = async (email) => {
    return await postDAO.getFriendsPostsByEmail(email);
}