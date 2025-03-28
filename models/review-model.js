const pool = require("../database/");

// This will provide the customer reviews displayed on view
async function getReviewById(review_id) {
    const result = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname, a.account_email, i.inv_make, i.inv_model, i.inv_year
      FROM public.review r
      JOIN public.account a ON r.account_id = a.account_id
      JOIN public.inventory i on i.inv_id = r.inv_id
      WHERE r.review_id = $1`,
      [review_id]
    );

    if (result.rows.length === 0) {
      throw new Error("No matching review id found");
    }
    return result.rows[0];
}
  
/* *****************************
 *   Register new account
 * *************************** */
async function registerReview(
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

// Updating the review item
async function updateReview(review_id, review_text) {
    const sql =
      "UPDATE public.review SET review_text = $1, review_date = NOW() WHERE review_id = $2 RETURNING *";
    const data = await pool.query(sql, [review_text, review_id]);
    if (data.rows.length === 0) {
      throw new Error("No matching review id found to update");
    }
    return data.rows[0];
  }

  //Deleting the review item
  async function deleteReview(review_id) {
    const sql = "DELETE FROM public.review WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    if (data.rowCount === 0) {
      throw new Error("No matching review id found to delete");
    }
    return true; // Return true if deletion was successful
  }

module.exports = {
  getReviewById,
  registerReview,
  updateReview,
  deleteReview,
};
