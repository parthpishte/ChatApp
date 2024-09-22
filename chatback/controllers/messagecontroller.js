import User from '../models/usermodel.js';
import Message from '../models/messagemodel.js';
import {mkdirSync, renameSync} from 'fs';
const getmessages = async (req, res) => {
    try {
        const { id } = req.body;
        const user1 = req.user._id;
        const user2 = id;
      if(!user1 || !user2){
        return res.status(400).json({ message: 'both userid are required' });
      }
     // console.log(user1,user2)
      
      const messages=await Message.find(
        {
            $or:[{
                sender:user1,recipient:user2
              // sender:'66e2e8327c5d0c260bf46f31',recipient:'66e2cd5e59eddaadf15531dd'
            },{
                sender:user2,recipient:user1
            }]
        }
      ).sort({timestamp:1})
      return res.status(200).json(messages)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  const uploadfile = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: 'file is required' });
        }
        const userid=req.user._id;
        const date=Date.now();
        let filedr=`uploads/files/${date}`
        let filename=`${filedr}/${req.file.originalname}`
         mkdirSync(filedr,{recursive:true})
         renameSync(req.file.path,filename)
         return  res.status(200).json({message:'file uploaded successfully',filepath:filename})
      
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  export { getmessages ,uploadfile};