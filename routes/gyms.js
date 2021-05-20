const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const gyms = require('../controllers/gyms');
const Gym = require('../models/gym');

const { isLoggedIn, isAuthor, validateGym } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(gyms.index))
    .post(isLoggedIn, upload.array('image'), validateGym, catchAsync(gyms.createGym));



router.get('/new', isLoggedIn, gyms.renderNewForm);

router.route('/:id')
    .get(catchAsync(gyms.showGym))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateGym, catchAsync(gyms.editGym))
    .delete(isLoggedIn, isAuthor, catchAsync(gyms.deleteGym));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm));

module.exports = router;