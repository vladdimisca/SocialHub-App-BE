const express = require('express');
const router = express.Router();

// services
const friendsService = require('../services/FriendsService');
const jwtService = require('../services/JwtService');

router.get('/api/checkFriendshipStatus', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const user = req.query.user;
    const userToCheck = req.query.userToCheck;
    const status = await friendsService.checkFriendshipStatus(user, userToCheck);

    res.status(200).send(JSON.stringify(status));
});

router.get('/api/getNumberOfFriendsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const numberOfFriends = await friendsService.getNumberOfFriendsByEmail(email);
    
    res.status(200).send(JSON.stringify(numberOfFriends));
});

router.get('/api/getFriendsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const friends = await friendsService.getFriendsByEmail(email);

    res.status(200).send(friends);
});

router.get('/api/getFriendRequestsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const friendRequests = await friendsService.getFriendRequestsByEmail(email);

    res.status(200).send(friendRequests);
});

module.exports = router;