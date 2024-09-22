import User from './usermodel.js';
import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
recipient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:false
},
messagetype:{
    type:String,
    enum:['text','image','video','file'],
    required:true
},
content: {
    type: String,
    required: function() {
        return this.messagetype === 'text';
    }
},
fileurl:{
    type:String,
    required:function(){
        return this.messagetype ==='file';
    }
},
},{
    timestamps:true,
   
})


const Message=mongoose.model('Message',messageSchema);
export default Message;

