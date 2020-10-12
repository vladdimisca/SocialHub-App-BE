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

module.exports.getUUIDByEmail = async (email) => {
    return await userDAO.getUUIDByEmail(email);
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

module.exports.getDescription = async (email) => {
    return await userDAO.getDescription(email);
}

module.exports.updateProfile = async (uuid, newFirstName, newLastName, newDescription) => {
    return await userDAO.updateProfile(uuid, newFirstName, newLastName, newDescription);
}