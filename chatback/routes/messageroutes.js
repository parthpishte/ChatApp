import {Router} from 'express';
import { getmessages,uploadfile } from '../controllers/messagecontroller.js';
import {verifyJWT} from '../middlewares/authmiddleware.js'
import multer from 'multer'
const upload=multer({dest:'uploads/files'})
const router = Router();
router.route('/getmessages').post(verifyJWT,getmessages)
router.route('/uploadfile').post(verifyJWT,upload.single('file'),uploadfile)
export default router;