var express =require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

var User = require('../models/User');

router.get('/register' , (req,res) => {
    res.render('user/register');
});

router.get('/login' , (req,res) => {
    res.render('user/login');
});

router.post('/register' , (req,res) => {
    const { name, phone , password, id} = req.body;
    let errors=[];

    if(!name || !phone || !id || !password ) {
        errors.push({msg: '모든 항목을 채워 주세요'});
    }

    if(password.length<6) {
        errors.push({msg : '비밀번호는 6자 이상이어야 합니다.'});
    }

    if(errors.length>0) {
        res.render('user/register', {
            errors,
            name,
            phone,
            password,
            id
        });
    } else {
        User.findOne({id:id})
            .then(user => {
                if(user) {
                    errors.push({msg: '중복된 id가 존재합니다.'});
                    res.render('user/register', {
                        errors,
                        name,
                        phone,
                        password,
                        id
                    });
                } else {
                    const newUser = new User ({
                        name,
                        phone,
                        password,
                        id
                    });

                    bcrypt.genSalt(10,(err,salt) => 
                        bcrypt.hash(newUser.password,salt,(err,hash) => {
                            if(err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg' , '회원가입이 완료 되었습니다. 로그인을 해주세요');
                                    res.redirect('/');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }
});

module.exports = router;


