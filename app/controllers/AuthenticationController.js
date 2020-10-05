const express = require('express');
const router = express.Router();

// models
const UserDTO = require('../dto/UserDTO');
const ExistingUserError = require('../errors/ExistingUserError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const WrongPasswordError = require('../errors/WrongPasswordError');

// services
const authenticationService = require('../services/AuthenticationService');

router.post('/api/register', async (req, res) => {
    try {
        const user = new UserDTO(undefined, req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        
        await authenticationService.register(user);

        res.status(200).send({
            success: 'You have been successfully registered!'
        })
    } catch(error) {
        if(error instanceof ExistingUserError) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send("Internal error!")
        }
        
    }
})

router.post('/api/login', async (req, res) => {
    try {
        await authenticationService.login(req.body.email, req.body.password);
        
        res.status(200).send({
            success: 'Valid credentials!'
        })
    } catch(error) {
        if(error instanceof UserNotFoundError || error instanceof WrongPasswordError) {
            res.status(500).send({
                error: error.message
            })} else {
                res.status(200).send({
                    error: "Internal error!"
                });
            }
    }
})

module.exports = router;