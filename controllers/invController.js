const { parse } = require("dotenv");
const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const reviewModel = require("../models/review-model");
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
    errors: null,
  });
};

/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryByInventoryId(inv_id);

    if (!data || data.length === 0) {
      throw new Error("Inventory not found");
    }
    const accountData = res.locals.accountData;
    const reviewData = await invModel.getReviewByInventoryId(inv_id); // Added 'await' and used inv_id directly
    // const errors = null; // Initialize errors
    const grid = await utilities.buildInventoryGrid(data, reviewData, accountData);
    const nav = await utilities.getNav();
    const brand = data[0].inv_make;
    const model = data[0].inv_model;
    const year = data[0].inv_year;

    res.render("./inventory/classification", {
      title: `${year} ${brand} ${model}`,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    console.error("Error building inventory by ID:", error.message);
    next(error); // Pass the error to the next middleware
  }
};

/* ***************************
 *  Add reviews
 * ************************** */
invCont.addReview = async function (req, res, next) {
  // Creates the process and registers the inventory.
  const { review_text, inv_id, account_id } = req.body;

  const regResult = await invModel.registerReview(review_text, inv_id, account_id);
  if (regResult) {
    let nav = await utilities.getNav();
    const inv_id = req.params.inv_id;
    const review_id = req.params.inv_id;
    // const account_id = parseInt(req.params.account_id);
    const data = await invModel.getInventoryByInventoryId(inv_id);
    const reviewData = await invModel.getReviewByInventoryId(review_id); // Fixed: Added 'await' here
    const accountData = res.locals.accountData;
    const grid = await utilities.buildInventoryGrid(
      data,
      reviewData,
      accountData
    );
    const brand = data[0].inv_make;
    const model = data[0].inv_model;
    const year = data[0].inv_year;
    // If the inventory is added, then the inventory registers, if not, the inventory has a server error.
    req.flash("notice", `Review Added`);
    res.redirect(`/inv/detail/${inv_id}`);
    // req.flash("notice", `Review Added`);
    // res.render("./inventory/classification", {
    //   title: year + " " + brand + " " + model,
    //   nav,
    //   errors: null,
    //   grid,
    // });
  } else {
    req.flash("notice", "Review Failed.");
    res.redirect(`/inv/detail/${inv_id}`);
    // res.status(501).render("inventory/classification", {
    //   title: "Inventory",
    //   nav,
    //   grid: null, // Fixed: Ensure 'grid' is defined even in failure cases
    // });
  }
};

invCont.buildManagement = async function (req, res) {
  // It contains the build Management view.
  const classificationList = await utilities.buildClassificationList();
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationList,
  });
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

// /* ****************************************
//  *  W9 Build edit inventory view
//  * *************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  // const classificationList = await utilities.buildClassificationList();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  W9 Delete Inventory View
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getInventoryById(inv_id);
  // const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}?`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Item Process
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    let nav = await utilities.getNav(); //An optional request
    req.flash("notice", "The deletion was successful."); //If the deletion is success, the item is deleted
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the deletion failed."); //If not, the deletion fails.
    res.redirect("/inv/delete/inv_id");
  }
};

//W12 Edit review controller
invCont.editReviewView = async function (req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id);
    const reviewData = await reviewModel.getReviewById(review_id);

    if (!reviewData) {
      throw new Error("Review not found");
    }

    const brand = reviewData.inv_make;
    const model = reviewData.inv_model;
    const year = reviewData.inv_year;
    let nav = await utilities.getNav();

    res.render("./inventory/edit-review", {
      errors: null,
      title: "Edit " + year + " " + brand + " " + model + " Review",
      nav,
      review_text: reviewData.review_text,
      inv_id: reviewData.inv_id,
      account_id: reviewData.account_id,
      account_firstname: reviewData.account_firstname,
      account_lastname: reviewData.account_lastname,
      review_id: reviewData.review_id,
    });
  } catch (error) {
    console.error("Error loading review for editing:", error.message);
    next(error); // Pass the error to the next middleware
  }
};
/* ***************************
 *  Process edit reviews
 * ************************** */
invCont.editReview = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
      review_id,
      review_text,
      review_date,
    
    } = req.body;
    const reviewResult = await reviewModel.updateReview(
      review_id,
      review_text,
      review_date,
    );
  
    if (reviewResult) {
      // const itemName = reviewResult.review_text;
      req.flash("notice", `Review updated.`);
      res.redirect("/account/");
    } else {
      req.flash("notice", "Review failed.");
      res.redirect("/account/");
    }
  };



/* ***************************
 *  W12 Delete Review View
 * ************************** */
invCont.deleteReviewView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.params.review_id);
  const reviewData = await reviewModel.getReviewById(review_id);
  // const itemData = await invModel.getReviewById(review_id);
  // const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const reviewName = `Delete ${reviewData.inv_make} ${reviewData.inv_model} Review?`;
  res.render("./inventory/delete-review", {
    title: reviewName,
    nav,
    errors: null,
    review_text: reviewData.review_text,
    inv_id: reviewData.inv_id,
    account_id: reviewData.account_id,
    account_firstname: reviewData.account_firstname,
    account_lastname: reviewData.account_lastname,
    review_id: reviewData.review_id,
  });
};

/* ***************************
 *  Delete Review Item Process
 * ************************** */
invCont.deleteReviewItem = async function (req, res, next) {
  const review_id = parseInt(req.body.review_id);
  const deleteResult = await reviewModel.deleteReview(review_id);

  if (deleteResult) {
    let nav = await utilities.getNav(); //An optional request
    req.flash("notice", "The review deletion was successful."); //If the deletion is success, the item is deleted
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the deletion failed."); //If not, the deletion fails.
    res.redirect("/account/");
  }
};
module.exports = invCont;
