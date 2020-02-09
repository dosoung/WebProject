var express =require('express');
var router = express.Router();
var Write = require('../model/Write');
const util = require('../util');


/**몽고 스키마의 이름이 다르면 그 collection이 달라진다 즉 Write모델과 Post모델이 다르다는 의미이다. 
*함수안에서 콜백이나 저장을 어떻게하는지는 상관이 없다. 여기서 저장한 객체는 html 파일에서 사용할때 필요하다. 
*/
//Index
router.get('/',(req,res) => {
    Write.find({})
    .sort('-createDate')
    .exec((err,posts) => {
        if(err) return res.json(err);
        res.render('posts/index',{posts:posts});
    });
});

//New
router.get('/new',(req,res) => {
    var post = req.flash('post')[0] || {}
    var errors = req.flash('errors')[0] || {}
    res.render('posts/new',{post:post, errors:errors});
});



//Show
router.get('/:id', (req,res) => {
    Write.findOne({_id:req.params.id},(err,post) => {
        if(err) return res.json(err);
        res.render('posts/show',{post:post});
    });
});

// create
router.post('/', function(req, res){
    Write.create(req.body, function(err, post){
      if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/new');
      }
      res.redirect('/posts');
    });
  });
  

  
  // edit
  router.get('/:id/edit', function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
      Write.findOne({_id:req.params.id}, function(err, post){
          if(err) return res.json(err);
          res.render('posts/edit', { post:post, errors:errors });
        });
    }
    else {
      post._id = req.params.id;
      res.render('posts/edit', { post:post, errors:errors });
    }
  });
  

//Update
router.put('/:id',(req,res) => {
    req.body.updateDate = Date.now();
    Write.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, (err,post) => {
        if(err) {
            req.flash('post', req.body);
            req.flash('errors', util.parseError(err));
        }
        res.redirect('/posts/'+req.params.id);
    });
});

//Delete
router.delete('/:id',(req,res) => {
    Write.deleteOne({_id:req.params.id},(err) => {
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});
module.exports = router;