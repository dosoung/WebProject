var mongoose = require('mongoose');

var postShcema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,require:true},
    createDate:{type:Date,default:Date.now()},
    updateDate:{type:Date},
});

var Write = mongoose.model('write',postShcema);

module.exports = Write;