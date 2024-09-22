import Channel from "../models/channelmodel.js";
import User from "../models/usermodel.js";




const createchannel = async (req, res) => {
    try {
      const{name,members}=req.body
     //console.log(req.body)
      const userid=req.user._id
     // console.log(userid)
      const admin=await User.findById(userid)
      //console.log(admin)
      if(!admin){
        return res.status(404).json({message:'User not found'})
      }
      let member=[]
      members.map((memberid)=>{
        member.push(memberid.value)
      })
      //console.log(member)
      const validmembers=await User.find({
        _id:{
          $in:member
        }
      })
      //console.log(validmembers)
      if(validmembers.length!==member.length){
        return res.status(400).json({message:'Invalid members'})
      }
      const newchannel=await new Channel({
        name,
        members:member,
        admin:userid
      })
      await newchannel.save()
      return res.status(201).json({message:'Channel created successfully',channel:newchannel})


  } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }






  const getuserchannels = async (req, res) => {
    try {
      const userid=req.user._id
      const channels=await Channel.find({
        $or:[
          {admin:userid},
          {members:userid}
        ]
      }).sort({updatedat:-1})
      

    return res.status(200).json({channels})
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  const getchannelmessages = async (req, res) => {
    try {
      const{channelid}=req.params
      const channel=await Channel.findById(channelid).populate({path:'messages',populate:{path:'sender',select:'firtname lastname email _id image color'}})
      if(!channel){
        return res.status(404).json({message:'Channel not found'})
      }
      const messages=channel.messages
      return res.status(200).json({messages})
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  export  {createchannel,getuserchannels,getchannelmessages}