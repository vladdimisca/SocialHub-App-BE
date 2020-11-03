const express = require('express');
const router = express.Router();

// models
const CommentDTO = require('../dto/CommentDTO');

const commentsService = require('../services/CommentService');

router.get('/api/getCommentsByPostId', async (req, res) => {
  

    const postId = req.query.postId;

    const comments = await commentsService.getCommentsByPostId(postId);
    
    res.status(200).send(comments);
});

module.exports = router;