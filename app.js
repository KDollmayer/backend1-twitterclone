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
  
const upload = multer({ storage: storage });

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: "kingking123",
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.authenticate("session"));

app.use(bodyParser.urlencoded({extended: true}))

const requireLogin = (req, res, next) => {  //login middleware för get()
       if (req.user) {
        next()
    } else {
        res.sendStatus(401).redirect("/login")
        
    }
}

//get

app.get("/index", requireLogin, async (req, res) => {
    
    var sortDate = { postDate: -1 };
    const posts = await Post.find().sort(sortDate)

    if (req.user) {
        res.render("./index.ejs", {
            username: req.user.username, 
            firstname:req.user.firstname, 
            posts 
            });
    } else {
        res.redirect("/login");
    }
})

// Posts

app.post("/entries", async (req, res) => {

    const postUser = req.user.username
    const postFirstname = req.user.firstname
    const postLastname = req.user.lastname
    const postEmail = req.user.email
    const { postContent } = req.body   
    const postDate = new Date();
    const postDateString = `${postDate.toLocaleDateString()} at ${postDate.toLocaleTimeString()}`
    const postImage = req.user.profileImage

    const newPost = new Post({ postContent, postDate, postUser, postDateString, postImage , postFirstname, postLastname, postEmail })
    await newPost.save()
    res.redirect("/index")
})

mongoose.connect("mongodb://localhost/twitter")
.then(console.log("Server UP KING"))

app.listen(PORT, () => {
    console.log(`server stardet at port: ${PORT}`)
})