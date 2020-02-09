var mongoose = require('mongoose');

var postShcema = mongoose.Schema({
    title:{
      type:String,
      required:[true,'제목이 필요합니다.']
    },
    body:{
      type:String,
      required:[true,'내용이 필요합니다.']
    },
    createDate:{type:Date,default:Date.now()},
    updateDate:{type:Date},
});

var Write = mongoose.model('write',postShcema);

module.exports = Write;