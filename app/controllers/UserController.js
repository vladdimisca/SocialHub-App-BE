const express = require('express');
const router = express.Router();

// services
const userService = require('../services/UserService');

router.get('/api/users', async (req, res) => {
    let users = await userService.getAllUsers();

    res.contentType('application/json');
    res.send(JSON.stringify(users));
})

router.get('/api/user', async(req, res) => {
    let user = await userService.getUserByUUID(req.query.uuid);
    
    res.status(200).send(user);
})

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
})

router.get('/api/userEmail', async (req, res) => {
    let email = await userService.getEmailByUUID(req.query.uuid);

    res.status(200).send({
        email: email 
    })
})

module.exports = router;