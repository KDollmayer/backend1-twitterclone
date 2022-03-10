const mongoose = require("mongoose")

const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstname: String,
    lastname: String,
    email: String,
    profileImage: {type: String, default: "boringUser.png"}
})
userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)

exports.User = User 