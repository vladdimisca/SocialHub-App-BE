const express = require('express');
const router = express.Router();

// services
const userService = require('../services/UserService');

router.get('/api/users', async (req, res) => {
    const users = await userService.getAllUsers();

    res.status(200).send(users);
});

router.get('/api/user', async(req, res) => {
    let user = await userService.getUserByUUID(req.query.uuid);
    
    res.status(200).send(user);
});

router.get('/api/userUUID', async (req, res) => {
    let uuid = '';

    try {
        uuid = await userService.getUUID(req.query.email);
    } catch(error) {
        console.log(error);
    } finally {
        res.status(200).send({
            uuid: uuid
        })
    }
});

router.get('/api/userEmail', async (req, res) => {
    let email = await userService.getEmailByUUID(req.query.uuid);

    res.status(200).send(JSON.stringify(email));
});

router.get('/api/userByEmail', async (req, res) => {
    const user = await userService.getUserByEmail(req.query.email);

    res.status(200).send({
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    })
});

router.get('/api/connections', async (req, res) => {
    const connections = await userService.getConnectionsByEmail(req.query.email);

    res.status(200).send(connections);
})


router.post('/api/setProfilePicture', async (req, res) => {
    let pictureURL = await userService.setProfilePicture(req.body.email, req.body.image);
    
    res.status(200).send(JSON.stringify(pictureURL));
});

router.get('/api/getProfilePicture', async (req, res) => {
    const pictureURL = await userService.getProfilePictureByEmail(req.query.email);

    res.status(200).send(JSON.stringify(pictureURL));
});

router.put('/api/changeDescription', async (req, res) => {
    const email = req.body.email;
    const newDescription = req.body.description;

    await userService.changeDescription(email, newDescription);

    res.status(200).send();
});

router.get('/api/getDescription', async (req, res) => {
    const email = req.query.email;

    const description = await userService.getDescription(email);

    res.status(200).send(JSON.stringify(description));
});

router.post('/api/addPost', async (req, res) => {
    const email = req.body.email;
    const description = req.body.description;
    const image = req.body.image;
    const timestamp = req.body.timestamp;

    const post = await userService.addPost(email, description, image, timestamp);

    res.status(200).send(post);
});

router.get('/api/getPostsByEmail', async (req, res) => {
    const email = req.query.email;

    const posts = await userService.getPostsByEmail(email);

    res.status(200).send(posts);
});

router.get('/api/checkFriendshipStatus', async (req, res) => {
    const user = req.query.user;
    const userToCheck = req.query.userToCheck;

    const status = await userService.checkFriendshipStatus(user, userToCheck);

    res.status(200).send(JSON.stringify(status));
});

router.get('/api/getFriendsPostsByEmail', async (req, res) => {
    const email = req.query.email;

    const posts = await userService.getFriendsPostsByEmail(email);

    res.status(200).send(posts);
});

router.get('/api/getNumberOfFriendsByEmail', async (req, res) => {
    const email = req.query.email;

    const numberOfFriends = await userService.getNumberOfFriendsByEmail(email);
    
    res.status(200).send(JSON.stringify(numberOfFriends));
});

module.exports = router;