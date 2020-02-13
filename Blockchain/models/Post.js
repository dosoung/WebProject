var mongoose = require('mongoose');

var postShcema = mongoose.Schema({
    title:{
      type:String,
      required:[true,'병원 이름']
    },
    body:{
      type:String,
      required:[true,'토큰 개수']
    },
    address: {
      type:String,
      required:[true,'주소 입력']
    },
    createDate:{type:Date,default:Date.now()},
    updateDate:{type:Date},
});

var Post = mongoose.model('post',postShcema);

module.exports = Post;