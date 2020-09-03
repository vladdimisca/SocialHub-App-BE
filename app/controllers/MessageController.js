const express = require('express');
const router = express.Router();

// services 
const messageService = require('../services/MessagesService');

router.get('/api/chat', async (req, res) => {
    let messages = await messageService.getAllMessagesByChat(req.query.chatId);
    
    res.contentType('application/json');
    res.send(JSON.stringify(messages));
})

module.exports = router;