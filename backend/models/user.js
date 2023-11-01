const mongoose = require('mongoose');
const {Schema}=mongoose;
const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true

    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true

    },
    Date:{
        type: Date,
        default:Date.now

    },
    anon:{
        type: String,
        default:"NO"
    },
    otp:{
        type:Number,
        default:"89548"

    },
    description:{
        type: String,
        required:true

    },
    verified:{
        type:String,
        default:'false'
        
    }
})
const User=mongoose.model('user',UserSchema);
User.createIndexes();
module.exports=User;