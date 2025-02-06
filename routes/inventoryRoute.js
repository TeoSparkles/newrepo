// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// router.get("/type/:classificationId", utilities.handleErrors(invController, buildByClassificationId))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory view
router.get("/detail/:invId", invController.buildByInventoryId)
module.exports = router;