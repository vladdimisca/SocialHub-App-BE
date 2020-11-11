const express = require('express');
const router = express.Router();

// models
const CommentDTO = require('../dto/CommentDTO');

const commentsService = require('../services/CommentService');
const likesService = require('../services/LikeService');

const jwtService = require('../services/JwtService');

router.get('/api/getCommentsByPostId', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const postId = req.query.postId;

    const comments = await commentsService.getCommentsByPostId(postId);
    
    res.status(200).send(comments);
});

router.get('/api/getLikesByPostId', async(req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(401).send({jwtError: error.message});
        return;
    } 

    const postId = req.query.postId;

    const likes = await likesService.getLikesByPostId(postId);
    
    res.status(200).send(likes);
})

module.exports = router;