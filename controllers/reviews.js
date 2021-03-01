const List = require('../models/list');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const list = await List.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    list.reviews.push(review);
    await review.save();
    await list.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/lists/${list._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/lists/${id}`);
};