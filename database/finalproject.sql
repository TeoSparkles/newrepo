-- Table structure for table `review`
CREATE TABLE IF NOT EXISTS public.review(
    review_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    review_text text NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    inv_id integer NOT NULL,
    account_id integer NOT NULL
);

async function getReviewsByInventoryId(inv_id) {
  try {
    // Query to fetch reviews with account details
    const data = await pool.query(
      `SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname 
       FROM reviews r
       JOIN accounts a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    
    // Transform data to include screen name
    const reviews = data.rows.map((review) => {
      const screenName = review.account_firstname.charAt(0).toUpperCase() + review.account_lastname.toLowerCase();
      return {
        ...review,
        screen_name: screenName, // Add screen_name to each review object
      };
    });

    return reviews;
  } catch (error) {
    console.error("getReviewsByInventoryId error " + error);
    throw error;
  }
}

async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_text, r.review_date, 
              CONCAT(UPPER(SUBSTRING(a.account_firstname, 1, 1)), LOWER(a.account_lastname)) AS screen_name
       FROM reviews r
       JOIN accounts a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInventoryId error " + error);
    throw error;
  }
}
-- Table structure for table 'messages'