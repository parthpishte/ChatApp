import mongoose from 'mongoose'
const channelSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ],
    createdat:{
        type:Date,
        default:Date.now
    },
    updatedat:{
        type:Date,
        default:Date.now
    }






    }
    
)
channelSchema.pre('save',function(next){
    this.updatedat=Date.now()
    next()
})
channelSchema.pre('findOneAndUpdate',function(next){
    this.set({updatedat:Date.now()})
    next()
})
const Channel=mongoose.model('Channel',channelSchema)
export default Channel
