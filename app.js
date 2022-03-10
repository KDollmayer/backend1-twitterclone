const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const path = require("path")
const bodyParser = require("body-parser")
const multer = require("multer")
const { User } = require("./models/user")
const { Post } = require("./models/post")

const app = express()
const PORT = 3000

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/image_user/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storage })
app.use(express.static("public"))
app.use(express.static("files"))
app.use(express.static("public/image_user"))
app.use(upload.single("file"))



passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(session({
    secret: "kingking123",
    resave: false,
    saveUninitialized: false
  }))
app.use(passport.authenticate("session"))

app.use(bodyParser.urlencoded({extended: true}))

const requireLogin = (req, res, next) => {  //login middleware för get()
       if (req.user) {
        next()
    } else {
        res.sendStatus(401).redirect("/login")
        
    }
}

//get
app.get("/", (req, res) => {
    res.render("./login.ejs")
})

app.get("/login", (req, res) => {
    res.render("./login.ejs")
})

app.get("/signup", (req, res) => {
    res.render("./signup.ejs")
})
app.get("/users/:userId", requireLogin, async (req, res) => {

    const userInfo = await User.find({ username: req.params.userId })
    const userPosts = await Post.find({ postUser: req.params.userId })
    console.log(req.params.userId)
    console.log(userPosts, userInfo)
    res.render("user.ejs", { userPosts, userInfo })
})
app.get("/profile", requireLogin, async (req, res) => {

    var sortDate = { postDate: -1 };
    const posts = await Post.find().sort(sortDate)
    

    res.render("./profile.ejs", {
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        profileImage: req.user.profileImage,
        postImage: req.user.profileImage,
        posts
        })
})

app.get("/index", requireLogin, async (req, res) => {
    
    var sortDate = { postDate: -1 };
    const posts = await Post.find().sort(sortDate)

    if (req.user) {
        res.render("./index.ejs", {
            username: req.user.username, 
            firstname:req.user.firstname, 
            posts 
            })
    } else {
        res.redirect("/login")
    }
})

// Posts

app.post("/entries", async (req, res) => {

    const postUser = req.user.username
    const postFirstname = req.user.firstname
    const postLastname = req.user.lastname
    const postEmail = req.user.email
    const { postContent } = req.body   
    const postDate = new Date()
    const postDateString = `${postDate.toLocaleDateString()} at ${postDate.toLocaleTimeString()}`
    const postImage = req.user.profileImage

    const newPost = new Post({ 
        postContent, 
        postDate, 
        postUser, 
        postDateString, 
        postImage , 
        postFirstname, 
        postLastname, 
        postEmail 
    })

    await newPost.save()
    res.redirect("/index")
})

app.post("/signup", async (req, res) => {
    const {username, password, firstname, lastname, email} = req.body
    const user = new User({username, firstname, lastname, email})
    await user.setPassword(password)
    await user.save()
    res.redirect("/login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login" 


}))

app.post("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
})
app.post("/edit_user", async (req, res) => {

    var query = {"username": req.user.username}
    const {firstname, lastname, email} = req.body;

    console.log(firstname, lastname, email)
 
    User.findOneAndUpdate(query, {$set: {firstname : firstname, lastname: lastname, email: email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Update failed");
        }
        res.redirect("/profile")
    })

})
app.post("/upload", async (req, res) => {
    
    const user = req.user

    user.profileImage = req.file.filename
    await user.save()

    res.redirect("/profile")
})


mongoose.connect("mongodb://localhost/twitter")
.then(console.log("Server UP KING"))

app.listen(PORT, () => {
    console.log(`server stardet at port: ${PORT}`)
})