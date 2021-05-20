const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogInForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.logIn);

router.get('/logout', users.logOut)

module.exports = router;