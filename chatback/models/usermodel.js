import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        
    },
    lastname:{
        type:String,
        
    },
    image:{
        type:String,
        
    },
    color:{
        type:Number,
    },
    profilesetup:{
        type:Boolean,
        default:false,
    },


    }

)
userschema.pre('save',async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
next()
})
const user=mongoose.model('User',userschema)
export default user

