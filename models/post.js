const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    postContent: {type: String, required: true, maxLength: 140},
    postDate: Date,
    postUser: String,
    postDateString: String, 
    postFirstname: String, 
    postLastname: String,
    postEmail: String
})

const Post = mongoose.model("Post", postSchema)
exports.Post = Post