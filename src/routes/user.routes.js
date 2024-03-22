import express from 'express';
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();
//upload is middlewares
router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 2
        },
        {
            name: 'coverImage',
            maxCount: 2
        }
    ]),
    registerUser
)

export default router