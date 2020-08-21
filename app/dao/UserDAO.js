const UserNotFoundError = require('../errors/UserNotFoundError');
const UserDetails = require('../dto/UserDetails');
const userDTO = require('../dto/UserDTO');
const db = require('../../app/utils/dbUtil');
const usersRef = db.collection('users'); 

module.exports.addUser = async (user) => {
    await usersRef.doc().set({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
    });
}

module.exports.getEmailByUUID = async (uuid) => {
    const user = await usersRef.doc(uuid).get();
    
    return user.data().email;
}

module.exports.getUserByEmail = async (email) => {
    let users = await usersRef.where('email', '==', email).get();

    if(users.empty) {
        throw new UserNotFoundError("User not found!");
    }
    
    let desiredUser = users.docs[0].data();

    return new userDTO(
                        desiredUser.firstName, 
                        desiredUser.lastName,
                        email,
                        desiredUser.password
                      );
}

module.exports.getAllUsers = async () => {
    let users = await usersRef.get();
    
    let usersArray = [];

    users.forEach(user => {
        const uuid = user.id;
        user = user.data();
        usersArray.push(new UserDetails(uuid, user.firstName, user.lastName, user.email));
    })

    return usersArray;
}

module.exports.getUserByUUID = async (uuid) => {
    const user = await usersRef.doc(uuid).get();
    
    return user.data();
}

module.exports.getUUID = async (email) => {
    let users = await usersRef.where('email', '==', email).get();

    if(users.empty) {
        throw new UserNotFoundError("User not found!");
    }
    
    let userUUID = users.docs[0].id;

    return userUUID;
}
