const { parse } = require("dotenv");
const invModel = require("../models/inventory-model");
// const accountModel = require("../models/account-model");
const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

/* ***************************
 *  W12 Add reviews
 * ************************** */
reviewController.addReview = async function (req, res, next) {
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
    // const brand = data[0].inv_make;
    // const model = data[0].inv_model;
    // const year = data[0].inv_year;
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



//W12 Edit review controller
reviewController.editReviewView = async function (req, res, next) {
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
reviewController.editReview = async function (req, res, next) {
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
reviewController.deleteReviewView = async function (req, res, next) {
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
reviewController.deleteReviewItem = async function (req, res, next) {
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

module.exports = reviewController;
