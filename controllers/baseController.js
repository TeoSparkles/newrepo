const { render } = require("ejs");
const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
    // const nav = await utilities.getNav(); // Commented out temporarily
  const nav = await utilities.getNav();
  // res.render("index", { nav })
  res.render("index", { title: "Home", nav }); 
};

module.exports = baseController;