const reviewController = {
    addReview: async (req, res) => {
        const { review_text, inv_id, account_id } = req.body;

        try {
            const newReview = await Review.create(review_text, inv_id, account_id);
            res.status(201).json(newReview);  // Return the new review as JSON
        } catch (err) {
            res.status(500).send("Error adding review");
        }
    },

    getReviews: async (req, res) => {
        try {
            const reviews = await Review.getAll();
            res.status(200).json(reviews);  // Return all reviews as JSON
        } catch (err) {
            res.status(500).send("Error fetching reviews");
        }
    }
};

module.exports = reviewController;
