const Config = require('../env/Config');
const admin = require('../../app/utils/dbUtil');
const friendsRef = admin.firestore().collection(Config.friendsCollection);

// services
const userService = require('../services/UserService');

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

module.exports.getNumberOfFriendsByEmail = async (email) => {
    const friends = await friendsRef.doc(email).collection('friends').get();

    let numberOfFriends = 0;

    if(!friends.empty) {
        numberOfFriends = friends.size;
    }
    
    return numberOfFriends;
}

module.exports.getFriendsByEmail = async (email, page, pageSize) => {
    const friendsCollection = await friendsRef.doc(email).collection('friends').get();
    const emailsArray = [];

    friendsCollection.forEach(friendDoc => {
        const friend = friendDoc.data();

        emailsArray.push(friend.email);
    });

    const friends = [];

    for(let friendEmail of emailsArray) {
        const friend = await userService.getUserByEmail(friendEmail);

        friends.push(friend);
    }

    return friends;
}

module.exports.getFriendRequestsByEmail = async (email) => {
    const friendRequestsCollection = await friendsRef.doc(email).collection('received-requests').get();
    const emailsArray = [];

    friendRequestsCollection.forEach(requestDoc => {
        const friendRequest = requestDoc.data();

        emailsArray.push(friendRequest.email);
    });

    const users = [];

    for(let requestEmail of emailsArray) {
        const user = await userService.getUserByEmail(requestEmail);

        users.push(user);
    }

    return users;
}