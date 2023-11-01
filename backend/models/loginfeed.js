const mongoose = require('mongoose');
const {Schema}=mongoose;

const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    user_name:{
        type:String,
        ref:'user_name'
    },
    title:{
        type: String,
        required: true

    },
    description:{
        type: String,
        required: true

    },
    tag:{
        type: String,
        default:"General"

    },
    Date:{
        type: Date,
        default:Date.now

    },
    visiblity:{
        type: String,
        default:"everyone"
    },
    filename: String,
    contentType: String,
    imageData: Buffer,
    voicefilename: String,
    voicecontentType: String,
    voiceNoteData: Buffer,
})

module.exports=mongoose.model('loginfeed',NotesSchema);