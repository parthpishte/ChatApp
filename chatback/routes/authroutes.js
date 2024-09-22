import {Router} from 'express';
import {signup,login,getuserinfo,updateprofile,addprofileimage,removeprofileimage,logout} from '../controllers/authcontroller.js'
import {verifyJWT} from '../middlewares/authmiddleware.js'
import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./uploads/profiles")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
  const upload = multer( {
    dest: "./uploads/profiles/",
    
    }
   );
  
const router = Router();
// router.post("/signup",signup)
router.route("/signup").post(signup)
router.route("/login").post(login)
router.route('/userinfo').get(verifyJWT,getuserinfo)
router.route('/updateprofile').post(verifyJWT,updateprofile)
router.route('/addprofileimage').post(verifyJWT,upload.single("profileimage"),addprofileimage)
router.route('/removeprofileimage').delete(verifyJWT,removeprofileimage)
router.route('/logout').get(verifyJWT,logout)
export default router

