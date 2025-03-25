const pool = require("../database/");

/* ********************************
 *  Get all the customer reviews*
 * ****************************** */

async function registerReview(review_text, inv_id, account_id) {
  try {
    const result = await db.query(`
      INSERT INTO review (review_text, inv_id, account_id)
      VALUES ($1, $2, $3) RETURNING *`,
      [review_text, inv_id, account_id]
  );
    return result.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

// This will provide the customer reviews displayed on view
async function getReviewById(review_id) {
  try {
    // If you want to fetch a specific review by review_id and order it by review_date DESC
    const result = await pool.query(
      'SELECT * FROM public.review WHERE review_id = $1 ORDER BY review_date DESC',
      [review_id] // You pass the review_id here as it's being used in the WHERE clause
    );

    // If no review is found with the provided review_id
    if (result.rows.length === 0) {
      return new Error("No matching review id found");
    }

    return result.rows[0]; // Return the review object if found
  } catch (error) {
    console.error(error);
    return new Error("An error occurred while fetching the review.");
  }
}
  
/* *****************************
 *   Register new account
 * *************************** */
async function registerReview(
  // review_id,
  review_text,
  review_date,
  account_id,
  inv_id,
) {
  try {
    const sql =
      "INSERT INTO public.review (review_id, review_text, review_date, account_id, inv_id) VALUES ($1, $2, NOW(), $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      review_text,
    review_date,
    account_id,
    inv_id,
    ]);
  } catch (error) {
    return error.message;
  }
}
//W9 Updating the inventory item
async function updateReview(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

  module.exports = {
    getReviewById,
    registerReview
  };
  