import express from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/me", authenticationMiddleware, userController.getProfile);
router.get("/list-match", authenticationMiddleware, (req, res, next) => {

    userController.getAll(req, res, next);
});



router.get("/:id", authenticationMiddleware, userController.getUserInfo);
router.put("/update-profile", authenticationMiddleware, userController.updateUser);


export default router;