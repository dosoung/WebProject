const User = require('../model/User');
const express = require('express');

const router = express.Router();

//New
router.get('/new', (req,res) => {
  var user = req.flash('user')[0] || {}
  var errors = req.flash('errors')[0] || {}
  res.render('users/new',{user:user, errors:errors});
});


//Create
router.post('/' ,(req,res) => {
  req.body.phone = req.body.phone1 + req.body.phone2;
  User.create(req.body,(err,user) => {
   
    if(err) {
      req.body.phone = req.body.phone2;
      req.flash('user',req.body );
      req.flash('errors',parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/');
  });
});

//Show
router.get(':username', (req,res) => {
  User.findOne({username:req.params.username}, (err,user) => {
    if(err) return res.json(err);
    res.render('users/show',{user:user});
  });
});

//edit
router.get(':username/edit', (req,res) => {
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if(!user) {
    User.findOne({username:req.params.username}, (err,user) => {
      if(err) return res.json(err);
      res.render('users/edit',{username:user.params.username, user:user, errors:erros});
    });
  } else {
    res.render('users/edit' , {username:req.params.username, user:user, errors:errors});
  }

});

//Update
router.put('/:username', (req,res) => {
  User.findOne({username :req.params.username})
  .select('password')
  .exec((err,user) => {
    if(err) return res.json(err);
    
    user.originPassword = user.password;
    user.password = req.params.newPassword ? req.body.newPassword : user.password;
    for(var p in req.body) {
      user[p] = req.body[p];
    }

    user.save((err,user) => {
      if(err) {
        req.flash('user', req.body);
        req.flash('errors', parseError(err));
        return res.redirect('/users/' + req.params.username +'/edit');
      }
      res.redirect('/users/' + user.username);
    });
  });
});


//Delete
router.delete('/:username' , (req,res) => {
  User.deleteOne({username:req.params.username}, (err) => {
    if(err) return res.json(err);
    res.redirect('/users');
  });
});

module.exports = router;


function parseError(errors){
  console.log("errors: ", errors)
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'이미 등록된 아이디 입니다.' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}