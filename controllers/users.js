const User = require('../models/user');
// const User = require('../models/user');
const Topic = require('../models/topic');

module.exports.renderRegister = (req, res) => {
    res.render('register');
}

module.exports.register = async (req, res) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username})
    const newUser = await User.register(user, password);

    req.login(newUser, err => {
        if(err) return next(err);
        res.redirect('/');
    });
    }
    catch (e) {
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('login');
}

module.exports.login = (req, res) => {
    req.flash('success', "Logged In");
    res.redirect('/');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Logged Out");
    res.redirect('/');
}

module.exports.renderSetup = async (req, res) => {
    const {theme, public} = req.query;

    const userUpdate = {
        defaultView: theme,
        public: public
    }
    const user = await User.findByIdAndUpdate(req.user._id, userUpdate, {omitUndefined:true});

    res.send("Success");
}

module.exports.saveUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    const topics = await Topic.find({user: req.user._id})
    res.render('setup', {user, topics})
}