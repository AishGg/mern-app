import express, { Router } from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followUnfollowuser } from '../controllers/user.controller.js';

const router = express.Router();

Router.get("/poffile/:usernaame",protectRoute, getUserProfile);
// Router.get("/suggested",protectRoute, getUserprofile);
Router.get("/follow/:id",protectRoute, followUnfollowuser);
// Router.get("/update", protectRoute,  updateUserProfile);
export default router;
