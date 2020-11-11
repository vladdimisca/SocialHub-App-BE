// app port
module.exports.port = 3000;

// firebase collections
module.exports.usersCollection = 'users';
module.exports.connectionsCollection = 'user-connections';
module.exports.profilePicturesCollection = 'profile-picture';
module.exports.descriptionsCollection = 'user-description';
module.exports.postsCollection = 'user-posts';
module.exports.chatsCollection = 'chats';  
module.exports.friendsCollection = 'user-friends';
module.exports.commentsCollection = 'comments';
module.exports.likesCollection = 'post-likes';

// bcrypt salt
module.exports.salt = 8;

// jwt secret key
module.exports.jwtSecretKey = 'SocialHub#JwtKey';

// jwt token expiration time
module.exports.jwtExpireTime = 3600;
