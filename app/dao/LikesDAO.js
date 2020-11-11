const Config = require('../env/Config');
const admin = require('../utils/dbUtil');
const likesRef = admin.firestore().collection(Config.likesCollection);
const userDTO = require('../dto/UserDTO');

module.exports.addLike = async (postId, email) => {
    const docs = await likesRef.doc(postId).collection('likes').where('email', "==", email).get();

    if(!docs.empty) {
        return;
    }

    await likesRef.doc(postId).collection('likes').doc().set({
        email: email
    });
}

module.exports.dislike = async (postId, email) => {
    const likes = await likesRef.doc(postId).collection('likes').where("email", "==", email).get();
    await likesRef.doc(postId).collection('likes').doc(likes.docs[0].id).delete();
}

module.exports.getLikes = async (postId) => {
    likes = await likesRef.doc(postId).collection('likes').get();
    
    const likesArray = [];

    likes.forEach (like => {
        like = like.data();
        likesArray.push(like.email);
    });
    
    return likesArray;
}