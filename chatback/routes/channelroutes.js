import {Router} from 'express';
import{createchannel,getuserchannels,getchannelmessages} from '../controllers/channelcontroller.js'
import {verifyJWT} from '../middlewares/authmiddleware.js'
import multer from 'multer';
const router = Router();
router.route('/createchannel').post(verifyJWT,createchannel)
router.route('/getuserchannels').get(verifyJWT,getuserchannels)
router.route('/getchannelmessages/:channelid').get(verifyJWT,getchannelmessages)
export default router