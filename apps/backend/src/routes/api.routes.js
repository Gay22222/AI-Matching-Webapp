import { Router } from "express";

const router = Router();
router.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express Backend!" });

});

/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

import messageRoutes from "./messages.routes.js";
import notificationRoutes from "./notifications.routes.js";
import reportRoutes from "./reports.routes.js";


// Tập hợp các route con
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);



/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/


export default router; 
