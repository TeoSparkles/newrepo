const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const messageModel = require("../models/message-model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { parse } = require("dotenv");
const invCont = require("./invController");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  // req.flash("notice", "This is a flash message.")
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  W12 Deliver account management view
 * *************************************** */
async function accountManagement(req, res, next) {
  //W12 create a review list.
  // const account_id = parseInt(res.params.account_id);
  const account_id = res.locals.accountData.account_id;
  const data = await accountModel.getReviewByAccountId(account_id)
  const reviewList = await utilities.buildReviewList(data);
  let nav = await utilities.getNav();
  res.render("./account/account", {
    title: "Account Management",
    nav,
    errors: null,
    reviewList
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function manageAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Manage Account",
    nav,
    errors: null,
  });
}

async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  });
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    const account_id = res.locals.accountData.account_id;
    const data = await accountModel.getReviewByAccountId(account_id)
    const reviewList = await utilities.buildReviewList(data);
    req.flash("notice", `Account updated.`);
    res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
      reviewList,
    });
  } else {
    req.flash("notice", "Sorry, update account failed.");
    res.status(501).render("account/update", {
      title: "Account Management",
      nav,
      errors: null,
      reviewList,
    });
  }
}
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id);

  if (updateResult) {
    req.flash("notice", "Password changed.");
    res.status(201).render("account/account", {
      title: "Manage Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, password failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

async function accountLogout(req, res) {
  let nav = await utilities.getNav();
  res.render("account/logout", {
    title: "Logout",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Compose the messages to the user
 * *************************************** */
// async function buildMessages(req, res, next) {
//   let nav = await utilities.getNav();
//   const accountData = res.locals.accountData.account_id;
//   // const data = await accountModel.getAccountById(account_id);
//   res.render("account/messages/compose-message", {
//     title: "Compose Message",
//     nav,
//     errors: null,
//     message_from: accountData.account_id,
//   });
// }
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  accountLogout,
  manageAccount,
  buildUpdateAccount,
  // buildChangePassword,
  updateAccount,
  updatePassword,
  // buildMessages
  // Logout
};
