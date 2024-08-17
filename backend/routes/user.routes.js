import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followUnfollowuser,getSuggestedProfile, updateUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:usernaame", protectRoute, getUserProfile);
router.get("/suggested",protectRoute, getSuggestedProfile);
router.post("/follow/:id", protectRoute, followUnfollowuser);
router.post("/update", protectRoute,  updateUser);

export default router;
