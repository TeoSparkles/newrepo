const utilities = require(".");
const reviewModel = require("../models/review-model");
const { body, validationResult } = require("express-validator");
const { options } = require("../routes/static");
const validate = {};

validate.reviewRules = () => {
  return [
    //Creates the classification ID that encounters the classification name of the list
    body("screenName")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide the screen naem."),

    // W7 Create a validation of make inventory or brand.
    body("review_text")
      .trim()
      .escape()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please comment the review."),
  ];
};

/* ***************************************************************
 * Check data and return errors or continue to add classification*
 * ***************************************************************/
validate.checkReviewData = async (req, res, next) => {
  const {
    review_text,
  } = req.body;

  //Create a list of validation errors in a set of inventory rules.
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // const classificationList = await utilities.buildClassificationList();
    res.render("inventory/:invId", {
      errors,
      title: "Inventory Detail",
      nav,
      review_text,
    });
    return;
  }
  next();
};
