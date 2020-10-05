const express = require('express');
const router = express.Router();

// services 
const messageService = require('../services/MessagesService');

router.get('/api/chat', async (req, res) => {
    let messages = await messageService.getAllMessagesByChat(req.query.chatId);
    
    res.contentType('application/json');
    res.send(JSON.stringify(messages));
})

router.get('/api/checkUnseenMessages', async (req, res) => {
    const sender = req.query.sender;
    const receiver = req.query.receiver;

    const status = await messageService.checkUnseenMessages(sender, receiver);

    res.status(200).send(status);
})

module.exports = router;