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

/* Post Register view*/
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
  
  

// W6 Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)



module.exports = router;