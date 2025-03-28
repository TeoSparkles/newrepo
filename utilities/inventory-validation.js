const utilities = require(".");
const inventoryModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model"); // Added this line
const { body, validationResult } = require("express-validator");
const { options } = require("../routes/static");
const validate = {};

/*********************************************Classification Part***********************************************/

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // Classification is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Please provide a classification name.")
      .isLength({ min: 1 })
      .custom(async (classification_name) => {
        const classExists = await inventoryModel.checkClassificationName(
          classification_name
        );
        if (classExists) {
          throw new Error("Classification exists. Try another name.");
        }
        return;
      }),
  ];
};

/* *********************************************************
 * Check data and return errors or continue to add classification*
 * *********************************************************/
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/**************************************************Inventory Part**********************************************/

/* ************************************
 *  W7 Inventory Data Validation Rules*
 * ********************************** */
validate.inventoryRules = () => {
  return [
    //Creates the classification ID that encounters the classification name of the list
    body("classification_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide the classification name."),

    // W7 Create a validation of make inventory or brand.
    body("inv_make")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a brand."),

    // W7 Create a validation of inventory model.
    body("inv_model")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    // W7 Describe a description of the inventory.
    body("inv_description")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    //Create a file path rule of the inventory image.
    body("inv_image")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Description must include a path name.")
      // The regex function shows like this.
      .matches(/\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Please use an image filepath."),

    //Create a file path rule of the inventory image thumbnail.
    body("inv_thumbnail")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Description must include a path name.")
      // The regex function shows like this.
      .matches(/\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Please use an image filepath thumbnail."),

    //Create an inventory price rule using an integer.
    body("inv_price")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please enter a price.")
      .isLength({ min: 1 })
      .withMessage("Please provide a price."),

    //Create a mileage rule for the distance range using an integer.
    body("inv_miles")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please enter a mileage.")
      .isLength({ min: 1 })
      .withMessage("Please provide miles."),

    //Create a color rule to provide a color.
    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Please enter a color.")
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
    //Set a year with a maximum of 4 length.
    body("inv_year")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please enter a year.")
      .isLength({ min: 1, max: 4 })
      .withMessage("Please provide a year."),
  ];
};

/* ***************************************************************
 * Check data and return errors or continue to add classification*
 * ***************************************************************/
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id, //Remember, the classification_id will include the primary key of the classification.
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

  //Create a list of validation errors in a set of inventory rules.
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
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
    });
    return;
  }
  next();
};

/* ***************************************************************
 * W9 Check data and return errors or continue to add classification*
 * ***************************************************************/
validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id, //Remember, the classification_id will include the primary key of the classification.
    inv_id,
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

  //Create a list of validation errors in a set of inventory rules.
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Update Inventory",
      nav,
      classificationList,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_year,
    });
    return;
  }
  next();
};

validate.reviewRules = () => {
  return [
    // Validate review text
    body("review_text")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 1, max: 500 }) // Set a maximum length of 500 characters
      .withMessage("Please comment the review (maximum 500 characters).")
      .custom((review_text) => {
        const prohibitedWords = ["spam", "offensive"]; // Example prohibited words
        for (const word of prohibitedWords) {
          if (review_text.toLowerCase().includes(word)) {
            throw new Error("Review contains prohibited content.");
          }
        }
        return true;
      }),
  ];
};

/* ***************************************************************
 * Check data and return errors or continue to add classification*
 * ***************************************************************/
validate.checkReviewData = async (req, res, next) => {
  const { review_text } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryByInventoryId(inv_id);

    if (!data || data.length === 0) {
      throw new Error("Inventory not found");
    }

    const accountData = res.locals.accountData;
    const reviewData = await invModel.getReviewByInventoryId(inv_id); // Added 'await' and used inv_id directly
    const grid = await utilities.buildInventoryGrid(
      data,
      reviewData,
      accountData
    );
    const nav = await utilities.getNav();
    const brand = data[0].inv_make;
    const model = data[0].inv_model;
    const year = data[0].inv_year;

    res.render("./inventory/classification", {
      title: `${year} ${brand} ${model}`,
      nav,
      grid,
      errors,
      review_text,
    });
    return;
  }
  next();
};

/* *********************************************************
 * Check data and return errors or continue to add classification*
 * *********************************************************/
validate.checkUpdateReviewData = async (req, res, next) => {
  const { review_id, review_text, account_id, inv_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      // const review = parseInt(req.params.review_id);
      // const reviewData = await reviewModel.getReviewById(review);
      // const brand = reviewData.inv_make;
      // const model = reviewData.inv_model;
      // const year = reviewData.inv_year;
      let nav = await utilities.getNav();

      res.render("inventory/edit-review", {
        errors,
        title: "Edit Review",
        nav,
        review_id,
        review_text,
        account_id, // Included account_id
        inv_id, // Included inv_id
      });
    } catch (error) {
      console.error("Error loading review for editing:", error.message);
      next(error); // Pass the error to the next middleware
    }
    return;
  }
  next();
};

module.exports = validate;
