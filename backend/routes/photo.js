const express = require('express');
const router = express.Router();
const uploadMiddleware= require('../middleware/uploadMiddleware');
const Photo = require('../models/photos');
const { body, validationResult } = require('express-validator');

router.post('/upload', uploadMiddleware.single('photo'), async (req, res) => {
    // Create a new photo document.
    const photo = new Photo({
      filename: req.file.filename,
      contentType: req.file.mimetype,
      imageData: req.file.buffer,
    });
  
    // Save the photo document to the database.
    await photo.save();
  
    // Send a response to the client.
    res.status(201).json({
      message: 'Photo uploaded successfully!',
      photoId: photo._id,
    });
  });

  router.get('/photo/:photoId', async (req, res) => {
    const photo = await Photo.findById(req.params.photoId);
    console.log(photo)
  
    if (!photo) {
      return res.status(404).send('Photo not found');
    }
  
    res.set('Content-Type', photo.contentType);
    res.send(photo.data);
  });

  module.exports = router;