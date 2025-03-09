/* Account Routes W6*/
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Validate register
const regValidate = require('../utilities/account-validation')

/* Deliver Login View W6 */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* Deliver Register View W6 */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* Deliver Account Management View W9 */
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))

/* Post Register view*/
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
/* W9 Provide the Log-in */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;