const express = require("express")
const router = new express.Router() 
// const invController = require("../controllers/invController")
// router.get("/type/:classificationId", utilities.handleErrors(invController, buildByClassificationId))

// Route to build inventory by classification view
router.get("/error", (req, res) => {
    throw new Error("This server was crashed.");
});

module.exports = router;