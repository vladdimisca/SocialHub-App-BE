const admin = require('firebase-admin');
var serviceAccount = require("../../permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://social-hub-3e295.firebaseio.com",
    storageBucket: "gs://social-hub-3e295.appspot.com/"
});

module.exports = admin;

