const express = require('express');
const router = express.Router();

// services
const userService = require('../services/UserService');

router.get('/api/users', async (req, res) => {
    const users = await userService.getAllUsers();

    res.send(users);
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

router.get('/api/userByEmail', async (req, res) => {
    const user = await userService.getUserByEmail(req.query.email);

    res.status(200).send({
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName
    })
})

router.get('/api/connections', async (req, res) => {
    const connections = await userService.getConnectionsByEmail(req.query.email);

    res.status(200).send(connections);
})

router.get('/api/usersByName', async (req, res) => {
    const users = await userService.getUsersByName(req.query.searchString);

    res.status(200).send(users);
})

module.exports = router;