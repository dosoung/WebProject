const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
var Web3 = require('web3');



router.get('/', function(req,res){
  res.render('home/login')
});

router.post('/', async function(req, res, next) {
  


    const address = req.body.address;
    console.log(req.body.address);


    // (1) #############
    // [ address의 토큰 잔액 가져오기 ]  https://web3js.readthedocs.io/en/v1.2.6/web3-eth.html#getbalance

    const balanceOfWei = await web3.eth.getBalance(address);

    // #############
    

    // (2) #############
    // [ balanceOfWei 값을 Ether 단위로 변환하기 ] https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#fromwei
    const balance = web3.utils.fromWei(balanceOfWei, 'ether');
    
    // #############

    res.render('home/home', { address, balance });
})






router.get('/send' ,(req,res) => {
  res.render('home/send'); 
});

router.post('/send', (req,res) => {
  // res.render()
});

router.get('/request',(req,res) => {
  res.render('home/request');
});

router.post('/request',(req,res) => {
  Post.create(req.body, function(err,post) {
    if(err) return res.json(err);
    res.redirect('/send');
  });
});

router.get('/donation',(req,res) => {
  Post.find({})
  .sort('createDate')
  .exec((err,posts) => {
    if(err) return res.json(err);
    res.render('home/donation', {posts:posts});
  });
})

module.exports = router;