const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const path = require("path")
const bodyParser = require("body-parser")
const multer = require("multer")

const app = express()
const PORT = 3000

app.get("/", (req,res) => {
    res.send("hello World")
})

mongoose.connect("mongodb://localhost/twitter")
.then(console.log("Server UP KING"))

app.listen(PORT, () => {
    console.log(`server stardet at port: ${PORT}`)
})