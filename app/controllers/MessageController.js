const express = require('express');
const router = express.Router();

// services 
const messageService = require('../services/MessageService');
const jwtService = require('../services/JwtService');

router.get('/api/getChatMessages', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const chatId = req.query.chatId;
    const messages = await messageService.getAllMessagesByChat(chatId);
    
    res.status(200).send(messages);
})

router.get('/api/checkUnseenMessages', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const sender = req.query.sender;
    const receiver = req.query.receiver;
    const status = await messageService.checkUnseenMessages(sender, receiver);

    res.status(200).send(status);
})

module.exports = router;