const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    name: {type: String, required:true},
    title: {type:String , required: true},
    body: {type:String, required: true},
    createdAt : {type:Date, default:Date.now()},
    updatedAt : {type:Date}
});


var Post = mongoose.model('Post', postSchema);

module.exports = Post;