const UserNotFoundError = require('../errors/UserNotFoundError');
const UserDTO = require('../dto/UserDTO');
const PostDTO = require('../dto/PostDTO');
const admin = require('../../app/utils/dbUtil');
const usersRef = admin.firestore().collection('users'); 
const connectionsRef = admin.firestore().collection('user-connections');
const friendsRef = admin.firestore().collection('user-friends');
const profilePictureRef = admin.firestore().collection('profile-picture');
const descriptionRef = admin.firestore().collection('user-description'); 
const postsRef = admin.firestore().collection('user-posts');
const bucket = admin.storage().bucket();
const stream = require('stream');

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

module.exports.setProfilePicture = async (email, image) => {
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];

    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
    
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
                reject(err);
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
        });
    });

    return await pictureURL;
}

module.exports.changeDescription = async (email, newDescription) => {
    await descriptionRef.doc(email).set({
        description: newDescription
    });
}

module.exports.getDescription = async (email) => {
    const descriptionDoc = await descriptionRef.doc(email).get();

    if(descriptionDoc.exists) {
        return descriptionDoc.data().description;
    }
    return "";
}

module.exports.addPost = async (email, description, image, timestamp) => {
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];

    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
    
    const file = bucket.file('posts/' + email + '/' + timestamp);
    
    let post = new Promise( async (resolve, reject) => {
        bufferStream.pipe(file.createWriteStream({
            metadata: {
            contentType: mimeType
            },
            public: true,
            validation: "md5"
        }))
            .on('error', (err) => {
                console.log('Error from image upload', err);
                reject(err);
            })
            .on('finish', async () => {
                await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 300 * 365 * 24 * 60 * 60 * 1000
            }).then(async signedUrls => {
                await postsRef.doc(email).collection('posts').doc().set({
                    description: description,
                    pictureURL: signedUrls[0],
                    timestamp: timestamp
                });

                resolve(new PostDTO(email, description, signedUrls[0], timestamp));
              });
           });
    })

    return await post;
}

module.exports.getPostsByEmail = async (email) => {
    const posts = await postsRef.doc(email).collection('posts').orderBy('timestamp', 'desc').get();
    const postsArray = [];

    posts.forEach(post => {
        post = post.data();

        postsArray.push(new PostDTO(email, post.description, post.pictureURL, post.timestamp));
    });

    return postsArray;
}

module.exports.sendFriendRequest = async (sender, receiver) => {
    await friendsRef.doc(sender).collection('sent-requests').doc().set({
        email: receiver
    });

    await friendsRef.doc(receiver).collection('received-requests').doc().set({
        email: sender
    });
} 

module.exports.acceptFriendRequest = async (sender, receiver) => {
    await friendsRef.doc(sender).collection('friends').doc().set({
        email: receiver
    });

    await friendsRef.doc(receiver).collection('friends').doc().set({
        email: sender
    });

    this.unsendFriendRequest(receiver, sender);
}

module.exports.removeFriend = async (user, friendToRemove) => {
    const friendDoc = await friendsRef.doc(user).collection('friends').where('email', '==', friendToRemove).get();
    const friendId = friendDoc.docs[0].id;

    const userDoc = await friendsRef.doc(friendToRemove).collection('friends').where('email', '==', user).get();
    const userId = userDoc.docs[0].id;

    await friendsRef.doc(user).collection('friends').doc(friendId).delete();
    await friendsRef.doc(friendToRemove).collection('friends').doc(userId).delete();
}

module.exports.unsendFriendRequest = async (sender, receiver) => {
    const receiverDoc = await friendsRef.doc(sender).collection('sent-requests').where('email', '==', receiver).get();
    const receiverId = receiverDoc.docs[0].id;

    const senderDoc = await friendsRef.doc(receiver).collection('received-requests').where('email', '==', sender).get();
    const senderId = senderDoc.docs[0].id;

    await friendsRef.doc(sender).collection('sent-requests').doc(receiverId).delete();
    await friendsRef.doc(receiver).collection('received-requests').doc(senderId).delete();
}

module.exports.checkFriendshipStatus = async (user, userToCheck) => {
    let status = await friendsRef.doc(user).collection('friends').where('email', '==', userToCheck).get();
    
    if(status.empty) {
        status = await friendsRef.doc(user).collection('received-requests').where('email', '==', userToCheck).get();

        if(status.empty) {
            status = await friendsRef.doc(user).collection('sent-requests').where('email', '==', userToCheck).get();
            
            if(status.empty) {
                return "none";
            } else {
                return "sent-request";
            }
        } else {
            return "received-request";
        }
    } else {
        return "friends";
    }
}

module.exports.getFriendsPostsByEmail = async (email) => {
    const friends = await friendsRef.doc(email).collection('friends').get();
    const friendsArray = [];

    friends.forEach(friendDoc => {
        const friend = friendDoc.data();

        friendsArray.push(friend.email);
    })

    const postsArray = [];

    for(let friend of friendsArray) {
        const friendPosts = await postsRef.doc(friend).collection('posts').get();

        friendPosts.forEach(post => {
            post = post.data();

            postsArray.push(new PostDTO(friend, post.description, post.pictureURL, post.timestamp));
        });
    }
    
    postsArray.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);

    return postsArray;
}

module.exports.getNumberOfFriendsByEmail = async (email) => {
    const friends = await friendsRef.doc(email).collection('friends').get();

    let numberOfFriends = 0;

    if(!friends.empty) {
        numberOfFriends = friends.size;
    }
    
    return numberOfFriends;
}

module.exports.updateProfile= async (uuid, newFirstName, newLastName, newDescription) => {
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