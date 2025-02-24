const pool = require("../database/");

/* *****************************
 *  Get all classification data*
 * *************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* **********************************************************************
 *  Get all inventory items and classification_name by classification_id*
 * ******************************************************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ********************************
 *  Get all inventory item details*
 * ****************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/******************************************************************************************************************* */
// /* ******************************
//  *   Register new classification*
//  * **************************** */
async function registerClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* ************************************
 *  Check for existing classification *
 * ********************************** */
async function checkClassificationName(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name= $1";
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/******************************************************************************************************************* */
/* *************************
 *  Register new inventory *
 * *********************** */
async function registerInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  inv_year
) {
  try {
    const sql =
      "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_year,
    ]);
  } catch (error) {
    return error.message;
  }
}

//Here is an optional tool for the existing list.
// /* ************************************
//  *  Check for existing classification *
//  * ********************************** */
// async function checkClassificationId(classification_id) {
//   try {
//     const sql = "SELECT * FROM classification WHERE classification_id= $1";
//     const classification = await pool.query(sql, [classification_id]);
//     return classification.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// }

// /* ************************************
//  *  Check for existing inventory      *
//  * ********************************** */
// async function checkInventoryMake(inv_make) {
//   try {
//     const sql = "SELECT * FROM inventory WHERE inv_make = $1";
//     const inventory = await pool.query(sql, [inv_make]);
//     return inventory.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// }

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  registerClassification,
  checkClassificationName,
  registerInventory,
};
