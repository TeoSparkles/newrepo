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
    console.error("getclassificationsbyid error " + error);
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

// W9 Modify the getInventoryById with update inventory form
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}
//W9 Updating the inventory item
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`;
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}
//W9 Delete Inventory Item
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id=$1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    new Error("Delete Inventory Error.");
  }
}

async function getReviewByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r 
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      WHERE r.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getReviewByInventoryId error: " + error);
  }
}

/* ********************************
 *  W12 Use this to process the customer review*
 * ****************************** */
async function registerReview(review_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO review (review_text, review_date, inv_id, account_id)
      VALUES ($1, NOW(), $2, $3) RETURNING *`;
    return await pool.query(sql, [review_text, inv_id, account_id]);
  } catch (error) {
    return error.message;
  }
}
async function getReviewIdByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r
      JOIN public.account AS a
      ON a.account_id = r.account_id 
      WHERE r.account_id = $1`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    return error.message;
  }
}
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  registerClassification,
  checkClassificationName,
  registerInventory,
  getInventoryById,
  updateInventory,
  deleteInventoryItem,
  getReviewByInventoryId,
  registerReview,
  getReviewIdByAccountId,
};

//Here is an optional tool for the existing list.

// SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description, i.inv_image,
// i.inv_thumbnail, i.inv_price, i.inv_miles, i.inv_color, i.classification_id,
// c.classification_name
// FROM public.inventory AS i
// JOIN public.classification AS c ON i.classification_id = c.classification_id
// WHERE i.inv_id = $1;

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
