const { Client } = require("pg");
const invModel = require("../models/inventory-model");
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
      grid += "<h3>Customer Reviews</h3>";
      // if (vehicle.reviews && vehicle.reviews.length > 0) {
      //   vehicle.reviews.forEach((review) => {
      //     grid += `<div class="review"><p><strong>${review.screenName}</strong>: ${review.text}</p></div>`;
      //   });
      // } else {
      //   grid += "<div class='FirstReview'><p>Be the first to write a review.</p></div>";
      // }
    });
    //W12 Create a form of the reviews
    // if (accountData.length > 0) {
    // accountData.forEach((account) => {
    // grid += `Testing "${accountData.account_firstname}"`

    if (accountData) {
      grid += `<form action='/inv/detail/review' method='post' class='form-account'>
  <fieldset>
    <div class="form-account-content">
      <label for="screenName">Screen Name:</label><br />
      <input
        type="text"
        id="screenName"
        required
        minlength="3"
        value="${accountData.screenName}"
      />
      </div>
      <div class="form-account-content">
      <label for="reviewText">Review text:</label><br />
      <input
        type="text"
        name="review_text"
        id="reviewText"
        required
        minlength="3"
      />
      </div>
       <div class="form-account-button">
      <button type="submit">Submit Review</button>
      </div>
      </fieldset>
    </form>

`;
    }
    // } else
    grid += "<p>You must <a href='/account/login'>log in</a> to review.</p>";
  }

  // )}}
  else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};
// /* **************************************
//  * ******Build the details view HTML*****
//  * *************************************/
// Util.buildInventoryGrid = async function (data) {
//   let grid;
//   if (data.length > 0) {
//     grid = '<div class="inv-detail">';
//     data.forEach((vehicle) => {
//       grid +=
//         '<img src="' +
//         vehicle.inv_image +
//         '" alt="Image of ' +
//         vehicle.inv_make +
//         " " +
//         vehicle.inv_model +
//         ' on CSE Motors">';
//       // grid += '<div >'
//       grid += "<ul class= inv-description>";
//       grid += "<li><h2>Details</h2></li>";
//       grid += "<li><b>Description: </b>" + vehicle.inv_description + "</li>";
//       grid +=
//         "<li><b>Price: </b>" +
//         "<span>$" +
//         new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
//         "</span></li>";
//       grid +=
//         "<li><b> Mileage </b>: " +
//         Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
//         "</li>";

//       grid += "<li><b>Color </b>: " + vehicle.inv_color + "</li></ul></div>";
//       // grid += '</div>';
//       grid += "<h2>Customer Reviews</h2>"
//       // grid += {classificationList}
//       grid += "<table id='inventoryDisplay'></table>"
//       grid += "<div class='FirstReview'><p>Be the first to write a review.</p></div>";
//       grid += '<p>This is a sample</p>'
//       grid += "<p>You must <a href='/account/login'>log in</a> to review.</p>";

//       // }
//     });
//   } else {
//     grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }

//   return grid;
// };

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

/* ****************************************
 * W9 Middleware to check token validity
 **************************************** */
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

/* ****************************************
 *  W9 Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

//Assignment 5
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
Util.checkAdminEmployee = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        if (
          decoded.account_type === "Employee" ||
          decoded.account_type === "Admin"
        ) {
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

/* **************************************
 * ******Build the review details in inventory view HTML*****
 * *************************************/
// Util.buildReviewGrid = async function (data) {
//   let reGrid;
//   if (data.length > 0) {
//     // grid = '<div class="inv-detail">';
//     data.forEach((review) => {
//       reGrid += "<ul class= inv-description>";
//       reGrid +=
//       reGrid += "<li><b>Color </b>: " + vehicle.inv_color + "</li></ul></div>";
//       // grid += '</div>';
//     });
//   } else {
//     grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }

//   return grid;
// };

// var token = jwt.sign({account_firstname: 'admin'})
module.exports = Util;

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
