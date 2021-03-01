const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams gives us access to the id for the url from the app.js 
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const List = require('../models/list');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;