import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followUnfollowuser } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/poffile/:usernaame", protectRoute, getUserProfile);
// Router.get("/suggested",protectRoute, getUserprofile);
router.post("/follow/:id", protectRoute, followUnfollowuser);
// Router.get("/update", protectRoute,  updateUserProfile);
export default router;
