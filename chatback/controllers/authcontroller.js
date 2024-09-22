import User from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { renameSync, unlinkSync } from 'fs';
import path from 'path';
import { use } from 'bcrypt/promises.js';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = async (email) => {
  return jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: maxAge });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await createToken(email);
    res.cookie('jwt', token, { maxAge, secure: true, sameSite: 'None', httpOnly: true });

    return res.status(200).json({ user, token, message: "User logged in" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password, firstname, lastname, image, color } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.create({ email, password, firstname, lastname, image, color });
    if (!user) {
      return res.status(400).json({ message: 'User not created' });
    }

    const token = await createToken(email);
    res.cookie('jwt', token, { maxAge, secure: true, sameSite: 'None', httpOnly: true });

    return res.status(200).json({ user, token, message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getuserinfo = async (req, res) => {
  try {
    console.log('getuserinfo called');
    const user = req.user;
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getuserinfo:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateprofile = async (req, res) => {
  const { firstname, lastname, image, color } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).send("Please enter all fields");
  }
  try {
    const userdata = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        firstname,
        lastname,
        image,
        color,
        profilesetup: true,
      }
    }, { new: true });
    return res.status(200).json(userdata);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addprofileimage = async (req, res, next) => {
  try {
    const userid = req.user._id;
    if (!req.file) {
      return res.status(400).send("Please upload a file");
    }
    const date = Date.now();
    let filename = 'uploads/profiles' + date + req.file.originalname;
    renameSync(req.file.path, filename);

    const user = await User.findByIdAndUpdate(userid, {
      $set:
       { 
        image: filename 
      }
    }, { new: true });
    console.log(user.image);
    return res.status(200).json(user.image);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const removeprofileimage=async(req,res)=>{
  try {
    const userid = req.user._id;
    
    const user=User.findById(userid);
    if (!user) {
     
      return res.status(400).json({ message: "User not found" });
    }
    if(user.image){
      unlinkSync(user.image);
      user.image=null
      await user.save()
    }
    return res.status(200).json({
      message:"profile image removed!!"
    })
    
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 ,secure: true, sameSite: 'None', httpOnly: true });
    return res.status(200).json({ message: 'User logged out' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
export { signup, login, getuserinfo, updateprofile, addprofileimage,removeprofileimage,logout };