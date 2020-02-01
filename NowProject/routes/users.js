// routes/users.js

var express = require('express');
var router = express.Router();
var User = require('../models/User');

// Index // 1
router.get('/', function(req, res){
  User.find({})
    .sort({id:1})
    .exec(function(err, users){
      if(err) return res.json(err);
      res.render('users/index', {users:users});
    });
});

// New
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', {user:user,errors:errors});
});

// create
router.post('/', function(req, res){
  User.create(req.body, function(err, user){
    if(err) {
      req.flash('user',req.body);
      req.flash('errors',parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/users');
  });
});

// show
router.get('/:id', function(req, res){
  User.findOne({id:req.params.id}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});

// edit
router.get('/:id/edit', function(req, res){
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if(!user) {
    User.findOne({id:req.params.id}, function(err,user) {
      if(err) return res.json(err);
      res.render('users/edit', {id:req.params.id,user:user,errors:errors});
    });
  }
  else {
    res.render('users/edit',{id:req.params.id,user:user,errors:errors});
  }
});

// update // 2
router.put('/:id', function(req, res, next){
  User.findOne({id:req.params.id}) // 2-1
    .select('password') // 2-2
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
      for(var p in req.body){ // 2-4
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function(err, user){
        if(err) {
          req.flash('user',req.body);
          req.flash('errors',parseError(err));
          return res.redirect('/users/'+req.params.id+'/edit');
      }
      res.redirect('/users/'+user.id);
  });
});
});

// destroy
router.delete('/:id', function(req, res){
  User.deleteOne({id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/users');
  });
});

module.exports = router;

// functions
function parseError(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('id') > 0) {
    parsed.username = { message:'This id already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}
