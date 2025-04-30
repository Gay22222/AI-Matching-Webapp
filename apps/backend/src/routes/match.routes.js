import express from "express";
import { matchController } from "../controllers/match.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
import { matchMiddleware } from "../middleware/match.middleware.js";

const router = express.Router();
router.get(
    "/:matchId",
    authenticationMiddleware,
    matchMiddleware,
    matchController.get
);
router.get("/", authenticationMiddleware, matchController.getAll);
router.post("/", authenticationMiddleware, matchController.create);

export default router;
