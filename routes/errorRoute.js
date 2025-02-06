const express = require("express");
const router = new express.Router();

// Route to error view to provide an optional error message.
router.get("/error", (req, res) => {
  throw new Error("The server has been crashed. Try a different route");
});

module.exports = router;
