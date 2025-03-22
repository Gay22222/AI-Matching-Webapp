import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messages.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/", getMessages);

export default router;
