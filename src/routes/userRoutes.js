import * as userController from "./../controllers/userController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";
import express from "express";

const router = express.Router();

/////////// User routes \\\\\\\\\\\\\\\\\\\\\
router.get("/me", protect, userController.getMe);
router.patch("/me", protect, userController.updateMe);
router.delete("/me", protect, userController.deleteMe);

//////////// Admin routes \\\\\\\\\\\\\\\\\
router.get("/", protect, restrictTo("admin"), userController.getAllUsers);

router
  .route("/:id")
  .get(protect, restrictTo("admin"), userController.getUserById)
  .patch(protect, restrictTo("admin"), userController.updateUser)
  .delete(protect, restrictTo("admin"), userController.deleteUser);

export default router;
