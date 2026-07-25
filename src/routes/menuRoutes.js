import express from "express";

import * as menuController from "./../controllers/menuController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(menuController.getAllMenuItems)
  .post(protect, restrictTo("OWNER", "ADMIN"), menuController.createMenuItem);

router
  .route("/:id")
  .get(menuController.getMenuItemById)
  .patch(protect, restrictTo("OWNER", "ADMIN"), menuController.updateMenuItem)
  .delete(protect, restrictTo("OWNER", "ADMIN"), menuController.deleteMenuItem);

export default router;
