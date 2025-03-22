/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messages.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/", getMessages);





export default router;

/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/