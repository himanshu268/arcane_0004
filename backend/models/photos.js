const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  imageData: Buffer,
});
module.exports=mongoose.model('Photo',PhotoSchema);