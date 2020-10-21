const express = require('express');
const router = express.Router();

// services
const userService = require('../services/UserService');
const jwtService = require('../services/JwtService');

router.get('/api/getAllUsers', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const users = await userService.getAllUsers();

    res.status(200).send(users);
});

router.get('/api/getUserByUUID', async(req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const uuid = req.query.uuid; 
    const user = await userService.getUserByUUID(uuid);
    
    res.status(200).send(user);
});

router.get('/api/getUUIDbyEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    let uuid;

    try {
        uuid = await userService.getUUIDByEmail(email);
    } catch(error) {
        console.log(error);
        res.status(500).send();
    } finally {
        res.status(200).send({
            uuid: uuid
        })
    }
});

router.get('/api/getEmailByUUID', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const uuid = req.query.uuid;
    let email = await userService.getEmailByUUID(uuid);

    res.status(200).send(JSON.stringify(email));
});

router.get('/api/getUserByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 
    
    const email = req.query.email;
    const user = await userService.getUserByEmail(email);

    res.status(200).send({
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    });
});

router.get('/api/getConnectionsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const connections = await userService.getConnectionsByEmail(email);

    res.status(200).send(connections);
})


router.post('/api/setProfilePicture', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const email = req.body.email;
    const image = req.body.image;
    const pictureURL = await userService.setProfilePicture(email, image);
    
    res.status(200).send(JSON.stringify(pictureURL));
});

router.get('/api/getProfilePicture', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const pictureURL = await userService.getProfilePictureByEmail(email);

    res.status(200).send(JSON.stringify(pictureURL));
});

router.get('/api/getDescriptionByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const description = await userService.getDescription(email);

    res.status(200).send(JSON.stringify(description));
});

router.put('/api/updateProfile', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const uuid = req.body.uuid;
    const newFirstName = req.body.firstName;
    const newLastName = req.body.lastName;
    const newDescription = req.body.description;

    const json = await userService.updateProfile(uuid, newFirstName, newLastName, newDescription);

    res.status(200).send(json);
});

module.exports = router;