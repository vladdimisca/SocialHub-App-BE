const UserNotFoundError = require('../errors/UserNotFoundError');
const UserDTO = require('../dto/UserDTO');
const db = require('../../app/utils/dbUtil');
const utils = require('../../app/utils/Utils');
const usersRef = db.collection('users'); 
const connectionsRef = db.collection('user-connections');

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

    return new UserDTO(
                        users.docs[0].id,
                        desiredUser.firstName, 
                        desiredUser.lastName,
                        email,
                        desiredUser.password
                      );
}

module.exports.getConnectionsByEmail = async (email) => {
    const connections = await connectionsRef.doc(email).collection('connections').orderBy('lastMessageTimestamp').get();

    const connectionsArray = [];

    for(let connection of connections.docs) {
        await this.getUserByEmail(connection.id).then(user => {
            connectionsArray.push({
                uuid: user.uuid,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }).catch(error => {
            console.log(error.message);
        }); 
    }

    return connectionsArray;
}

module.exports.getAllUsers = async () => {
    let users = await usersRef.get();
    
    let usersArray = [];

    users.forEach(user => {
        const uuid = user.id;
        user = user.data();
        usersArray.push(new UserDTO(uuid, user.firstName, user.lastName, user.email, undefined));
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

module.exports.getUsersByName = async (searchString) => {
    let users = await this.getAllUsers();
    const targetUsers = [];

    users.forEach(user => {
        let fullName = user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase();
        let reversedFullName = user.lastName.toLowerCase() + ' ' + user.firstName.toLowerCase();

        if(utils.similarity(searchString, fullName) > 0.4 || utils.similarity(searchString, reversedFullName) > 0.4) {
            targetUsers.push(user);
        }   
    });

    return targetUsers;
}
