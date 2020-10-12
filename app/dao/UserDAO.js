const Config = require('../env/Config');
const Utils = require('../utils/Utils');
const UserNotFoundError = require('../errors/UserNotFoundError');
const UserDTO = require('../dto/UserDTO');
const admin = require('../../app/utils/dbUtil');
const usersRef = admin.firestore().collection(Config.usersCollection); 
const connectionsRef = admin.firestore().collection(Config.connectionsCollection);
const profilePictureRef = admin.firestore().collection(Config.profilePicturesCollection);
const descriptionRef = admin.firestore().collection(Config.descriptionsCollection); 
const bucket = admin.storage().bucket();

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
    const users = await usersRef.where('email', '==', email).get();

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
    const connections = await connectionsRef.doc(email).collection('connections').orderBy('lastMessageTimestamp', 'desc').get();
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
    const users = await usersRef.get();
    const usersArray = [];

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

module.exports.getUUIDByEmail = async (email) => {
    const users = await usersRef.where('email', '==', email).get();

    if(users.empty) {
        throw new UserNotFoundError("User not found!");
    }
    
    const userUUID = users.docs[0].id;

    return userUUID;
}

module.exports.setProfilePicture = async (email, image) => {
    const mimeType = Utils.getImageType(image);
    const bufferStream = Utils.passImageToStream(image);
    
    const file = bucket.file('profilePicture/' + email);
    
    let pictureURL = new Promise( async (resolve, reject) => {
        bufferStream.pipe(file.createWriteStream({
            metadata: {
            contentType: mimeType
            },
            public: true,
            validation: "md5"
        }))
            .on('error', (err) => {
                console.log('Error from image upload', err);
                return reject(err);
            })
            .on('finish', async () => {
                await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 300 * 365 * 24 * 60 * 60 * 1000
            }).then(async signedUrls => {
                await profilePictureRef.doc(email).set({
                    pictureURL: signedUrls[0]
                });
                resolve(signedUrls[0]);
              });
           });
    })

    return await pictureURL;
}

module.exports.getProfilePictureByEmail = async (email) => {
    const profilePicture = profilePictureRef.doc(email); 

    const pictureURL = new Promise( async (resolve, reject) => {
        profilePicture.get().then(async (document) => {
            if(document.exists) {
                resolve(await document.data().pictureURL);
            } else {
                resolve(null);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            return reject(error);
        });
    });

    return await pictureURL;
}

module.exports.getDescription = async (email) => {
    const descriptionDoc = await descriptionRef.doc(email).get();

    if(descriptionDoc.exists) {
        return descriptionDoc.data().description;
    }
    return "";
}

module.exports.updateProfile = async (uuid, newFirstName, newLastName, newDescription) => {
    await usersRef.doc(uuid).update({
        firstName: newFirstName,
        lastName: newLastName
    });

    const email = await this.getEmailByUUID(uuid);

    await descriptionRef.doc(email).set({
        description: newDescription
    });

    return { user: new UserDTO(uuid, newFirstName, newLastName, email, undefined), description: newDescription }
}