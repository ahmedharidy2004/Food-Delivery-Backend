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
router.get("/", protect, restrictTo("ADMIN"), userController.getAllUsers);

router
  .route("/:id")
  .get(protect, restrictTo("ADMIN"), userController.getUserById)
  .patch(protect, restrictTo("ADMIN"), userController.updateUser)
  .delete(protect, restrictTo("ADMIN"), userController.deleteUser);

export default router;
