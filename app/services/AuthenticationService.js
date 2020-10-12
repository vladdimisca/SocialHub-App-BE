// services
const userService = require('./UserService');
const encryptionService = require('./EncryptionService');
const jwtService = require('./JwtService');

// exceptions
const ExistingUserError = require('../errors/ExistingUserError');
const WrongPasswordError = require('../errors/WrongPasswordError');

module.exports.register = async (user) => {
    user.password = encryptionService.encrypt(user.password);
    let existingUser;

    try {
        existingUser = await userService.getUserByEmail(user.email);
    } catch(error) {
        await userService.addUser(user);
    } finally {
        if(existingUser !== undefined) {
            throw new ExistingUserError('User already exists!');
        }
    }
} 

module.exports.login = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    const checkPassword = await encryptionService.compareData(password, user.password);

    if(!checkPassword) {
        throw new WrongPasswordError('Invalid password!')
    }

    return jwtService.generateToken(user.uuid);
}