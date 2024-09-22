import Message from '../models/messagemodel.js';
import User from '../models/usermodel.js';
const searchcontact = async (req, res) => {
    try {
      const{searchterm}=req.body
      if(!searchterm){
        return res.status(400).json({ message: 'Please enter valid contact' });
      }
      const sanitizesearch=searchterm.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&"
      )
      const regex=new RegExp(sanitizesearch,'i')
      const contacts=await User.find(
        {
            $and:[{_id:{$ne:req.user._id}},
            {$or:[{firstname:regex},{lastname:regex},{email:regex}]}
            ]
        }
      )
      return res.status(200).json(contacts)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  const getcontactsfordm = async (req, res) => {
    try {
      const userid=req.user._id
    //  console.log(userid)
      if(!userid){
        return res.status(400).json({ message: 'Userid is required' });
      }
      const contacts = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userid }, { recipient: userid }],
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ['$sender', userid] },
                then: '$recipient',
                else: '$sender',
              },
            },
            lastmessagetime: { $first: '$timestamp' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'contactinfo',
          },
        },
        {
          $unwind: '$contactinfo',
        },
        {
          $project: {
            _id: 1,
            firstname: '$contactinfo.firstname',
            lastname: '$contactinfo.lastname',
            email: '$contactinfo.email',
            image: '$contactinfo.image',
            color: '$contactinfo.color',
            lastmessagetime: 1,
          },
        },
        {
          $sort: { lastmessagetime: -1 },
        },
      ]);
      return res.status(200).json(contacts)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  const getallcontacts = async (req, res) => {
    try {
      const users=await User.find({_id:{$ne:req.user._id}},'firstname lastname _id')
      const contacts=users.map(user=>(
        {
          label:user.firstname?`${user.firstname} ${user.lastname}`:user.email,
          value:user._id,

        }
      ))
       
      return res.status(200).json(contacts)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  export { searchcontact,getcontactsfordm ,getallcontacts };