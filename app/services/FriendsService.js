const friendsDAO = require('../dao/FriendsDAO');

module.exports.sendFriendRequest = async (sender, receiver) => {
    await friendsDAO.sendFriendRequest(sender, receiver);
}

module.exports.acceptFriendRequest = async (sender, receiver) => {
    await friendsDAO.acceptFriendRequest(sender, receiver);
}

module.exports.removeFriend = async (user, friendToRemove) => {
    await friendsDAO.removeFriend(user, friendToRemove);
}

module.exports.unsendFriendRequest = async (sender, receiver) => {
    await friendsDAO.unsendFriendRequest(sender, receiver);
}

module.exports.checkFriendshipStatus = async (user, userToCheck) => {
    return await friendsDAO.checkFriendshipStatus(user, userToCheck);
}

module.exports.getNumberOfFriendsByEmail = async (email) => {
    return await friendsDAO.getNumberOfFriendsByEmail(email);
}

module.exports.getFriendsByEmail = async (email) => {
    return await friendsDAO.getFriendsByEmail(email);
}

module.exports.getFriendRequestsByEmail = async (email) => {
    return await friendsDAO.getFriendRequestsByEmail(email);
}