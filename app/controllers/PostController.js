const paginate = require('jw-paginate');
const express = require('express');
const router = express.Router();

// services
const postService = require('../services/PostService');
const jwtService = require('../services/JwtService');

router.post('/api/addPost', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.body.email;
    const description = req.body.description;
    const image = req.body.image;
    const timestamp = req.body.timestamp;

    const post = await postService.addPost(email, description, image, timestamp);

    res.status(200).send(post);
});

router.get('/api/getPostsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;

    const posts = await postService.getPostsByEmail(email);

    res.status(200).send(posts);
});

router.get('/api/getFriendsPostsByEmail', async (req, res) => {
    const token = req.headers['x-access-token'];

    try {
        jwtService.verifyToken(token);
    } catch(error) {
        res.status(501).send({jwtError: error.message});
        return;
    } 

    const email = req.query.email;
    const page = req.query.page || 1;
    const posts = await postService.getFriendsPostsByEmail(email);
    const pageSize = 5;
    const pager = paginate(posts.length, page, pageSize);
    let pageOfPosts = [];
    
    if(page * (pageSize - 1) <= posts.length) {
        pageOfPosts = posts.slice(pager.startIndex, pager.endIndex + 1);
    } 

    res.status(200).send(pageOfPosts);
});

module.exports = router;