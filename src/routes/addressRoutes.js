import express from "express";
import * as addressController from "./../controllers/addressController.js";
import { protect } from "./../middleware/protect.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(addressController.getMyAddresses)
  .post(addressController.createAddress);

router
  .route("/:id")
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

export default router;
