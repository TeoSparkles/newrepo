/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements    *
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute"); //Connected to inventory route.
const utilities = require("./utilities/"); //Connected to the utilities route.
const errorRouter = require("./routes/errorRoute"); //Connected to the Error Route
/* **************************
 * View Engine and Templates*
 ****************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.get("/favicon.ico", (req, res) => res.status(204).end()); //No response on this code.
app.set("layout", "./layouts/layout");
// app.use(express.static('public'))

/* ***********************
 * Routes                *
 *************************/
app.use(static);

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// res.render("index", { title: "Home" });

// Inventory routes
app.use("/inv", inventoryRoute);
app.use(errorRouter); //Using the errorRouter for the errorRoute

// res.render("index", { title: "Home" });
// app.get("/", function (req, res) {
// });

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  });
});

/* *********************************
 * Express Error Handler           *
 * Place after all other middleware*
 ***********************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message =
      "It appears that the server was crashed. How about try a different route?";
    // message = err.message; This is an optional message for the errorRoute.js
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
