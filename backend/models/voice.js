const mongoose = require('mongoose');

const VoiceNoteSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  voiceNoteData: Buffer,
});

module.exports=mongoose.model('VoiceNote', VoiceNoteSchema);