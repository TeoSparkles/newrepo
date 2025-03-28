/* Account Routes W6*/
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Validate register
const regValidate = require("../utilities/account-validation");

/* Deliver Login View W6 */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* Deliver Register View W6 */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* Deliver Account Management View W9 */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);

/* Post Register view*/
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
/* W9 Provide the Log-in */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//This is an optional route.
// router.get(
//   "/management",
//   utilities.handleErrors(accountController.manageAccount)
// );

/***************************Assignment 5 **************************/
//Access the update account router file, including the accountData.account_id in the controller and view.
router.get(
  "/update/:accountId",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

//The update account process the data in the account controller.
router.post(
  "/update",
  regValidate.updateDataRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);
//The password data process the data in the account controller.
router.post(
  "/change-password",
  regValidate.updatePasswordRules(),
  // regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);
//Task 6: Similar to buildManagement view of the inventory route that handles the logout process in the utlilities index file.
router.get(
  "/logout",
  utilities.checkLogout,
  utilities.handleErrors(accountController.accountLogout)
); //regValidate.checkLogout
module.exports = router;
