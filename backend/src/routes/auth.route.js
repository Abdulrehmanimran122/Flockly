import express from "express";
import { login, logout, onaboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../utils/fileUpload.js"; // Import the upload middleware

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding",
    express.json({ limit: '10mb' }),
    protectRoute,
    upload.single('profilePic'),
    onaboard
);

// check If User is loged in or not
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user })
});

export default router;