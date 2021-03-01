const express = require('express');
const router = express.Router();
const lists = require('../controllers/lists');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateList } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const List = require('../models/list');
const { populate } = require('../models/list');
const { array } = require('joi');


router.route('/')
    .get(catchAsync(lists.index))
    .post(isLoggedIn, upload.array('image'), validateList, catchAsync(lists.createAdventure))

router.get('/new', isLoggedIn, lists.renderNewForm);

router.route('/:id')
    .get(catchAsync(lists.showAdventure))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateList, catchAsync(lists.updateAdventure))
    .delete(isLoggedIn, isAuthor, catchAsync(lists.deleteAdventure))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(lists.renderEditForm));


module.exports = router;