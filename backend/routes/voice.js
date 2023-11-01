const express = require('express');
const router = express.Router();
const voicemiddleware= require('../middleware/voicemiddleware');
const VoiceNote = require('../models/voice');

router.post('/uploadvoice', voicemiddleware.single('voice'), async (req, res) => {
    // Create a new voice note document.
    const voiceNote = new VoiceNote({
      filename: req.file.filename,
      contentType: req.file.mimetype,
      voiceNoteData: req.file.buffer,
    });
  
    // Save the voice note document to the database.
    await voiceNote.save();
  
    // Send a response to the client.
    res.status(201).json({
      message: 'Voice note uploaded successfully!',
      voiceNoteId: voiceNote._id,
    });
  });

  router.get('/voicenotes/:voiceNoteId', async (req, res) => {
    const voiceNoteId = req.params.voiceNoteId;
    const voiceNote = await VoiceNote.findById(voiceNoteId);
    console.log(voiceNote)
  
    if (!voiceNote) {
      return res.status(404).send('Voice note not found');
    }
  
    // Set the content type to audio/mpeg (or the appropriate audio format)
    res.set('Content-Type', 'audio/mpeg');
  
    // Send the voice note data as the response
    res.send(voiceNote);
  });

  module.exports = router;