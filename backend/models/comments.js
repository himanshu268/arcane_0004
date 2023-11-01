const mongoose = require('mongoose');
const {Schema}=mongoose;

const CommentsSchema = new Schema({
    postid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    user_name:{
        type:String,
        ref:'user_name'
    },
    username_id:{
        type: String,
        required: true

    },
    comment:{
        type: String,
        required: true

    },
    Date:{
        type: Date,
        default:Date.now

    },
})

module.exports=mongoose.model('Comment',CommentsSchema);