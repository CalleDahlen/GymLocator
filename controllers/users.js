const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Gym Locator!');
            res.redirect('/gyms');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

};

module.exports.renderLogInForm = (req, res) => {
    res.render('users/login')
};

module.exports.logIn = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/gyms';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/gyms');

};