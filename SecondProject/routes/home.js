var express = require('express');
var router = express.Router();
const passport = require('../config/passport');
const User = require('../model/User');

router.get('/' , (req,res) => {
    res.render('home/welcome');
});
router.get('/about', (req,res) => {
    res.render('home/about');
});


router.get('/login',(req,res) => {
    var username = req.flash('username')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login', {
        username: username,
        errors: errors
    });
});

router.post('/login', 
    function (req,res,next) {
        var errors = {};
        var isValid = true;

        if(!req.body.username) {
            isValid = false;
            errors.username = '아이디를 입력 해 주세요';
        }
        if(!req.body.password) {
            isValid = false;
            errors.password = '비밀번호를 입력 해 주세요';
            req.flash('username',req.body.username);
        }
        if(isValid) {
            next();
        }
        else {
            req.flash('errors',errors);
            res.redirect('/login');
            req.flash('username',req.body.username);
        }
    },
    passport.authenticate('local-login' , {
        successRedirect : '/',
        failureRedirect : '/login',
    })
);

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;