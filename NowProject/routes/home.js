var express= require('express')
var router = express.Router();
var passport = require('../config/passport');



router.get('/', (req, res) => {
    res.render('home/welcome');
});

router.get('/about', (req,res) => {
    res.render('home/about');
});

router.get('/login', (req,res) => {
    var id = req.flash('id')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login', {
        id:id,
        errors:errors
    });
});

router.post('/login',(req,res,next) => {
    var errors = {};
    var isValid = true;

    if(!req.body.id) {
        isValid = false;
        errors.id = 'ID is required';
    }
    if(!req.body.password) {
        isValid = false;
        errors.password = 'Password is required';
    }

    if(isValid) {
        next();
    }
    else {
        req.flash('errors',errors);
        res.redirect('/login');
    }
},
passport.authenticate('local-login', {
    successRedirect:'/',
    failureRedirect: '/login'
}
));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  

module.exports = router;