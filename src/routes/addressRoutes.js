import express from "express";
import { body } from "express-validator";
import * as addressController from "./../controllers/addressController.js";
import { protect } from "./../middleware/protect.js";
import { validateInput } from "./../middleware/validateInput.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(addressController.getMyAddresses)
  .post(
    validateInput([
      body("street").trim().notEmpty().withMessage("Street is required"),
      body("city").trim().notEmpty().withMessage("City is required"),
      body("country").trim().notEmpty().withMessage("Country is required"),
      body("zipCode").trim().notEmpty().withMessage("Zip code is required"),
    ]),
    addressController.createAddress,
  );

router
  .route("/:id")
  .patch(
    validateInput([
      body("street")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Street cannot be empty"),
      body("city")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("City cannot be empty"),
      body("country")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Country cannot be empty"),
      body("zipCode")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Zip code cannot be empty"),
    ]),
    addressController.updateAddress,
  )
  .delete(addressController.deleteAddress);

export default router;
