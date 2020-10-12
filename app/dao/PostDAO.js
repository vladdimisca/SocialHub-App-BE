const Config = require('../env/Config');
const Utils = require('../utils/Utils');
const admin = require('../../app/utils/dbUtil');
const postsRef = admin.firestore().collection(Config.postsCollection);
const bucket = admin.storage().bucket();
const PostDTO = require('../dto/PostDTO');

// services
const friendsService = require('../services/FriendsService');

module.exports.addPost = async (email, description, image, timestamp) => {
    const mimeType = Utils.getImageType(image);
    const bufferStream = Utils.passImageToStream(image);
    
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
                return reject(err);
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

module.exports.getFriendsPostsByEmail = async (email) => {
    const friends = await friendsService.getFriendsByEmail(email);
    const postsArray = [];

    for(let friend of friends) {
        const friendPosts = await postsRef.doc(friend.email).collection('posts').get();

        friendPosts.forEach(postDoc => {
            const post = postDoc.data();

            postsArray.push(new PostDTO(friend.email, post.description, post.pictureURL, post.timestamp));
        });
    }
    
    postsArray.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);

    return postsArray;
}