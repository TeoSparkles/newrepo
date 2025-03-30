const { Client } = require("pg");
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model"); // Add this line
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/*****************************************
 * Constructs the nav HTML unordered list*
 *****************************************/
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML****
 * **************************************/
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildInventoryGrid = async function (data, reviewData, accountData) {
  let grid = ""; // Initialize grid variable to ensure it's always returned

  if (data.length > 0) {
    data.forEach((vehicle) => {
      grid += '<div class="inv-detail">';

      // Vehicle image and details
      grid +=
        '<img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors">';
      grid += "<ul class='inv-description'>";
      grid += "<li><h2>Details</h2></li>";
      grid += "<li><b>Description: </b>" + vehicle.inv_description + "</li>";
      grid +=
        "<li><b>Price: </b>" +
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span></li>";
      grid +=
        "<li><b>Mileage</b>: " +
        Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
        "</li>";
      grid += "<li><b>Color</b>: " + vehicle.inv_color + "</li>";
      grid += "</ul></div>";

      //--------------------------------------- W12 Customer reviews section-----------------------------------------------//
      grid += "<h3><b>Customer Reviews</b></h3>";

      if (reviewData.length > 0) {
        reviewData.forEach((review) => {
          // grid += `<div class="review-display">`;
          grid += `<div class="review-item">`;
          const formattedDate = new Intl.DateTimeFormat("en-US").format(
            new Date(review.review_date)
          );
          grid += `<p><strong>${
            review.account_firstname[0] + review.account_lastname
          } </strong>`;
          grid += `<em>wrote on ${formattedDate}</em></p>`;
          grid += `<p>${review.review_text}</p>`;
          grid += `</div>`;
          // grid += `</div>`
        });
      } else {
        grid +=
          "<div class='FirstReview'><p>Be the first to write a review.</p></div>";
      }
      grid += `<h3><b>Write a Review</b></h3>`;
      if (accountData) {
        grid += ``;
        grid += `<form action='/inv/detail/${vehicle.inv_id}' method='post' class='form-account'>
  <fieldset>
    <div class="form-account-content">
      <label for="screenName">Screen Name:</label><br />
      <input
        type="text"
        id="screenName"
        readonly
        value="${accountData.account_firstname[0] + accountData.account_lastname}"
      />
    </div>
    <div class="form-account-content">
      <label for="reviewText">Review text:</label><br />
      <textarea name="review_text" id="reviewText" required minlength="3" maxlength="500"></textarea>
    </div>
    <input type="hidden" name="account_id" ${
      accountData.account_id ? `value="${accountData.account_id}"` : ""
    }>
    <input type="hidden" name="inv_id" ${
      vehicle.inv_id ? `value="${vehicle.inv_id}"` : ""
    }>
    <div class="form-account-button">
      <button type="submit">Submit Review</button>
    </div>
  </fieldset>
  </form>`;
      } else {
        grid +=
          "<p>You must <a href='/account/login'>log in</a> to review.</p>";
      }
    });
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};


// This contains a classification list of the inventory.
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
 * W9 Middleware to check token validity*
 ****************************************/
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* *****************************************
 *  W9 Check Login to access the login view.
 * *****************************************/
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

//Assignment 5
//Optional
// Task 2: In the middleware, using the JWT token and checks the account type
// and only allows access to any administrative and employee views or processes
// that will add/edit/delete items of classifications and vehicles.
// Util.checkAdminEmployee = (req, res, next) => {
//   if (req.cookies.jwt) {
//     jwt.verify(
//       req.cookies.jwt,
//       process.env.ACCESS_TOKEN_SECRET,
//       function (err, decoded) {
//         // Check for errors during JWT verification or if decoded is null
//         if (err || !decoded) {
//           return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Now safely check account_type
//         if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
//           next();
//         } else {
//           return res.status(403).json({ message: 'Forbidden' });
//         }
//       },
//     );
//   } else {
//     return res.status(401).json({ message: 'No token provided' });
//   }
// };

//Assignment 5
//Task 3: In the middleware, using the JWT token and checks the account type
Util.checkAdminEmployee = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        // Check for errors during JWT verification or if decoded is null
        if (
          decoded.account_type === "Employee" ||
          decoded.account_type === "Admin"
        ) {
          // If the account type is Employee or Admin, allow access to the next middleware or route handler
          next();
        } else {
          req.flash("notice", "You cannot access to this session.");
          // res.clearCookie('jwt')
          return res.redirect("account/login");
        }
      }
    );
    //Take note that if the employee or an admin can access
    // the inventory management, the process continues.
    // Else, the client won't access and return to the login process.
    // If there is a guest tries to access the inventory management, the login process will redirect.
  } else {
    req.flash("notice", "Please log in.");
    res.redirect("account/login");
  }
};

//Assignment 5
//Task 5: Creates the client, employee, and admin to update the account
Util.checkUpdate = (req, res, next) => {
  res.clearCookie("jwt");
  next();
};

//Task 6: Creates the client, employee, and admin to log out.
Util.checkLogout = (req, res) => {
  // jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
  res.clearCookie("jwt");
  res.redirect("/");
};

/* *****************************************************************
 * ***W12 Build the review details in the account management view***
 * *****************************************************************/
Util.buildReviewList = async function (data) {
  let list = ""; // Initialize grid variable to ensure it's always returned.

  if (data.length > 0) {
    data.forEach((review) => {
      list += `<div class=table-item>`;
      list += `<p><strong>Reviewed the ${review.inv_year} ${review.inv_make} ${review.inv_model}</strong></p>`;
      list += `<p><em>On ${new Intl.DateTimeFormat("en-US").format(
        new Date(review.review_date)
      )}</em></p>`;
      list += `<table class="button-table">`;
      list += `<tr><td colspan="3">${review.review_text}</td></tr>`;
      list += `<tr>`;
      list += `<td><a href="/inv/detail/${review.inv_id}" class="view-link">View Vehicle</a></td>`;
      list += `<td><a href="/inv/detail/edit/review/${review.review_id}" class="edit-link">Edit</a></td>`;
      list += `<td><a href="/inv/detail/delete/${review.review_id}" class="delete-link">Delete</a></td>`;
      list += `</tr>`;
      list += `</table>`;
      list += `</div>`;
      // list += "</div>";
    });
  } else {
    list += '<p class="notice">No reviews.</p>';
  }

  return list;
};

//W12 Check if the user is authorized to edit or delete a review.
// This middleware checks if the user is authorized to edit or delete a review.
Util.checkAccountId = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, decoded) {
        if (err || !decoded) {
          req.flash("notice", "Invalid token. Please log in again.");
          return res.redirect("/account/login");
        }

        const reviewId = req.params.review_id; // Extract the review ID from the request parameters.
        const review = await reviewModel.getReviewById(reviewId); // Fetch the review by ID using await function.
        
        // If the account ID from the JWT token does not match, then the user is not authorized.
        if (review.account_id !== decoded.account_id) {
          req.flash(
            "notice",
            "You do not have permission to edit this review."
          );
          return res.redirect("/account");
        }

        next();
      }
    );
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
