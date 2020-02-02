var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');

router.get('/', (req,res) => {
    Post.find({})
    .populate('author')
    .sort('-createdAt')
    .exec((err,posts) => {
        if(err) return res.json(err);
        res.render('posts/index', {posts: posts});
    });
});

router.get('/new' ,util.isLoggedin, (req,res) => {
    var post = req.flash('post')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('posts/new',{post:post,errors:errors});
});

router.post('/', util.isLoggedin, function(req, res){
    req.body.author = req.user._id; // 2
    Post.create(req.body, function(err, post){
      if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/new');
      }
      res.redirect('/posts');
    });
  });
  
  
//show
router.get('/:id', function(req, res){
    Post.findOne({_id:req.params.id}) // 3
      .populate('author')             // 3
      .exec(function(err, post){      // 3
        if(err) return res.json(err);
        res.render('posts/show', {post:post});
      });
  });
  
  

// edit
router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
        Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        res.render('posts/edit', {post:post,errors:errors});
        });
    }
    else {
        post._id = req.params.id;
        res.render('posts/edit',{post:post,errors:errors});
    }   
  });
  
router.put('/:id' , util.isLoggedin, checkPermission, (req,res) => {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id : req.params.id} , req.body, {runValidators:true} ,(err,post) => {
        if(err) {
            req.flash('post',req.body);
            req.flash('errors',util.parseError(err));
            return res.redirect('/posts/'+req.params.id+'/edit');
        }
        res.redirect('/posts/'+req.params.id);
    });
    
});

router.delete('/:id' , util.isLoggedin, checkPermission, (req,res) => {
    Post.deleteOne({_id: req.params.id} , (err) => {
        if(err) return res.json(err);
        res.redirect('/posts');                         //redirect에는 /로시작
    });
});

module.exports = router;

function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      if(post.author != req.user.id) return util.noPermission(req, res);
  
      next();
    });
  }
  