const mongoose = require('mongoose');
const mongooseURI="mongodb://127.0.0.1:27017/arcane_04"
const connecttomongoo=()=>{
    mongoose.connect(mongooseURI);
}
console.log("connect to Mongoose");
module.exports = connecttomongoo;