const multer = require('multer');

const voicemiddleware = multer({
  dest: './uploads/',
});
module.exports = voicemiddleware;