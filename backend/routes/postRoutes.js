import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POSTS ROUTER
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({}).exec();
        res.status(200).json({success: true, data: posts});
    } catch (error) {
        alert("Error from Mongo DB: " + error.message)
        res.status(500).json({success: false, message: error.message});
    }

});


// POST ROUTE TO CREATE NEW POST
router.route('/').post(async (req, res) => {
    // console.log(req.body);
    try {
        const { email, prompt, photo } = req.body;
        const emailString = email.toString();
        const promptString = prompt.toString();
        const photoURL = await cloudinary.uploader.upload(photo);

        console.log(photoURL.url);

        const newPost = await Post.create({
            email: emailString,
            prompt: promptString,
            photo: photoURL.url,
        });

        res.status(201).json({success: true, data: newPost});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
});

export default router;