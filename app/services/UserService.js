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

module.exports.getUsersByName = async (searchString) => {
    return await userDAO.getUsersByName(searchString);
}