const likesDAO = require ('../dao/LikesDAO');

module.exports.addLike = async (postId, email) => {
    await likesDAO.addLike(postId, email);
}

module.exports.dislike = async (postId, email) => {
    await likesDAO.dislike(postId, email);
}

module.exports.getLikesByPostId = async(postId) => {
    return await likesDAO.getLikes(postId);
} 