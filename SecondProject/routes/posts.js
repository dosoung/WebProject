var express =require('express');
var router = express.Router();
var Write = require('../model/Write');

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
    res.render('posts/new');
});

//Create
router.post('/',(req,res) => {
    Write.create(req.body,(err,post) =>{
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

//Show
router.get('/:id', (req,res) => {
    Write.findOne({_id:req.params.id},(err,post) => {
        if(err) return res.json(err);
        res.render('posts/show',{post:post});
    });
});

//Edit
router.get('/:id/edit',(req,res) => {
    Write.findOne({_id:req.params.id}, (err,post) => {
        if(err) return res.json(err);
        res.render('posts/edit',{post:post});
    });
});

//Update
router.put('/:id',(req,res) => {
    req.body.updateDate = Date.now();
    Write.findOneAndUpdate({_id:req.params.id}, req.body, (err,post) => {
        if(err) return res.json(err);
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