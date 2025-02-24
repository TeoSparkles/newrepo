const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    // errors: null
  });
};

/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const grid = await utilities.buildInventoryGrid(data);
  let nav = await utilities.getNav();
  const brand = data[0].inv_make;
  const model = data[0].inv_model;
  const year = data[0].inv_year;
  res.render("./inventory/classification", {
    title: year + " " + brand + " " + model,
    nav,
    grid,
  });
};

invCont.buildManagement = async function (req, res) {
  // It contains the build Management view.
  const nav = await utilities.getNav();
  res.render("./inventory/management", { title: "Management", nav });
};

// /* ****************************************
//  *  Deliver add-classification view
//  * *************************************** */
invCont.buildClassification = async function (req, res, next) {
  //It contains the add classification view.
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

// /* ****************************************
//  *  Process add-classification
//  * *************************************** */
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body; //Creates the classification name of the registered function.
  const regResult = await invModel.registerClassification(classification_name); //This will register the classification_name
  if (regResult) {
    //If the classification name is added, the classification name is added,
    // if not, the registration fails and the server error the message.
    req.flash("notice", `Classification Added`);
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Registration",
      nav,
    });
  }
};

invCont.buildInventory = async function (req, res, next) {
  //This will connect to the add inventory route.
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  // const classification_id = req.query.classificationId;
  // const data = await invModel.getInventoryByClassificationId(classification_name)
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

// /* ****************************************
//  *  Process add-inventory
//  * *************************************** */
invCont.registerInventory = async function (req, res, next) {
  //Creates the process and registers the inventory.
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(); //Creates the classification List in the inventory-model
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_year,
  } = req.body;

  const regResult = await invModel.registerInventory(
    //This will register the inventory in the inventory-model
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_year
  );
  if (regResult) {
    //If the inventory is added, then the inventory registers, if not, the inventory has a server error.
    req.flash("notice", `Inventory Added`);
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationList,
      errors: null,
    });
  } else {
    req.flash("notice", "Add Inventory failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
    });
  }
};

module.exports = invCont;