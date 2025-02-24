// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Validate register
const regValidate = require("../utilities/inventory-validation");

// router.get("/type/:classificationId", utilities.handleErrors(invController, buildByClassificationId))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory view
router.get("/detail/:invId", invController.buildByInventoryId);

// router.get("./inv", invController.buildManagement)
router.get("/", invController.buildManagement);

/*********************Add Classification view and post*********************/
/* W7 Delivers Add Classification view to the controller View */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildClassification) //This is directly to the invController.
);

// W7 Process the classification data
router.post(
  "/add-classification",
  regValidate.classificationRules(), //W7 Registers and Validates the classification rules using inventory-validation.
  regValidate.checkClassificationData, //W7 Check the classification data to validate the rules in inventory-validation.
  utilities.handleErrors(invController.registerClassification) //This is directly to the invController.
);

/*********************Add Inventory view and post*********************/
/* W7 Delivers Add Inventory view to the controller View  */
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildInventory) //This is directly to the invController.
);

// W7 Process the inventory data the same as classification data
router.post(
  "/add-inventory",
  regValidate.inventoryRules(), //W7 Registers and Validates the rules using inventory-validation.
  regValidate.checkInventoryData, //W7 The inventory data will validate the rules in the inventory-validation.
  utilities.handleErrors(invController.registerInventory) //This is directly to the invController.
);

module.exports = router;
