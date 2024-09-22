import {Router} from 'express';
import { searchcontact,getcontactsfordm, getallcontacts } from '../controllers/contactcontroller.js';
import {verifyJWT} from '../middlewares/authmiddleware.js'
const router = Router();
router.route("/searchcontact").post(verifyJWT,searchcontact)
router.route("/getcontactsfordm").get(verifyJWT,getcontactsfordm)
router.route("/getallcontacts").get(verifyJWT,getallcontacts)
export default router