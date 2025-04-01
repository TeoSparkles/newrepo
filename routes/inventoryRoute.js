// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const reviewController =require("../controllers/reviewController");
const utilities = require("../utilities");

// Validate register
const regValidate = require("../utilities/inventory-validation");

// router.get("/type/:classificationId", utilities.handleErrors(invController, buildByClassificationId))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// router.get("./inv", invController.buildManagement)
router.get("/", utilities.checkAdminEmployee, invController.buildManagement);

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

/******************* W9 Adding, Modify, and Deleting Viewing Route ***************************** */
// W9 Add a new route that works with the URL in the JS file.
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//W9 Add a new route controlled by edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

// A new route with comment to handle the incoming request.
router.post(
  "/update/",
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//W9 Add a new route controlled by delete inventory view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
);

// A new route to handle the incoming request of a delete inventory view.
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteItem)
);

//W12 Post Review
router.post(
  "/detail/:inv_id",
  regValidate.reviewRules(), // Validation rules for review input
  regValidate.checkReviewData, // Middleware to check validation results
  utilities.handleErrors(reviewController.addReview) // Controller to handle adding the review
);

//W12 Edit Review
router.get(
  "/detail/edit/review/:review_id", utilities.checkAccountId,
  utilities.handleErrors(reviewController.editReviewView)
);
//W12 Edit Review
router.post(
  "/detail/edit/review",
  regValidate.reviewRules(), // Validation rules for review input
  regValidate.checkUpdateReviewData, // Middleware to check validation results
  utilities.handleErrors(reviewController.editReview)
);

router.get(
  "/detail/delete/review/:review_id", utilities.checkAccountId,
  utilities.handleErrors(reviewController.deleteReviewView)
);

router.post(
  "/detail/delete/review",
  utilities.handleErrors(reviewController.deleteReviewItem)
);

module.exports = router;
