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
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const errorRouter = require("./routes/errorRoute")
/* **************************
 * View Engine and Templates*
 ****************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.get('/favicon.ico', (req, res) => res.status(204).end()); //No response on this code.
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

app.use(errorRouter);




// utilities.handleErrors(baseController.buildHome);
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

// // Server not found route
// app.use(async (req, res, next) => {
//   next({
//     status: 500,
//     message: "It appears the server has crashed.",
//   });
// });

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
    message = "It appears that the server was crashed. How about try a different route?";
    // message = err.message;
  }
  
  res.render("errors/error", {
    title: err.status || 'Server Error',
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
