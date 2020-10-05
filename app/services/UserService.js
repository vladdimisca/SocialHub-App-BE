const userDAO = require('../dao/UserDAO');

module.exports.addUser = async (user) => {
    await userDAO.addUser(user);
}

module.exports.getEmailByUUID = async (uuid) => {
    return await userDAO.getEmailByUUID(uuid);
}

module.exports.getUserByEmail = async (email) => {
    return await userDAO.getUserByEmail(email);
}

module.exports.getAllUsers = async () => {
    return await userDAO.getAllUsers();
}

module.exports.getUserByUUID = async (uuid) => {
    return await userDAO.getUserByUUID(uuid);
}

module.exports.getUUID = async (email) => {
    return await userDAO.getUUID(email);
}

module.exports.getConnectionsByEmail = async (email) => {
    return await userDAO.getConnectionsByEmail(email);
}

module.exports.setProfilePicture = async (email, image) => {
    return await userDAO.setProfilePicture(email, image);
} 

module.exports.getProfilePictureByEmail = async (email) => {
    return await userDAO.getProfilePictureByEmail(email);
}

module.exports.changeDescription = async (email, newDescription) => {
    await userDAO.changeDescription(email, newDescription);
}

module.exports.getDescription = async (email) => {
    return await userDAO.getDescription(email);
}

module.exports.addPost = async (email, description, image, timestamp) => {
    return await userDAO.addPost(email, description, image, timestamp);
}

module.exports.getPostsByEmail = async (email) => {
    return await userDAO.getPostsByEmail(email);
}

module.exports.sendFriendRequest = async (sender, receiver) => {
    await userDAO.sendFriendRequest(sender, receiver);
}

module.exports.acceptFriendRequest = async (sender, receiver) => {
    await userDAO.acceptFriendRequest(sender, receiver);
}

module.exports.removeFriend = async (user, friendToRemove) => {
    await userDAO.removeFriend(user, friendToRemove);
}

module.exports.unsendFriendRequest = async (sender, receiver) => {
    await userDAO.unsendFriendRequest(sender, receiver);
}

module.exports.checkFriendshipStatus = async (user, userToCheck) => {
    return await userDAO.checkFriendshipStatus(user, userToCheck);
}

module.exports.getFriendsPostsByEmail = async (email) => {
    return await userDAO.getFriendsPostsByEmail(email);
}

module.exports.getNumberOfFriendsByEmail = async (email) => {
    return await userDAO.getNumberOfFriendsByEmail(email);
}