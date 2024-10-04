const express = require("express");
const app = express();
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash")
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({secret: "mysupersecret", resave: false, saveUninitialized: true}));
app.use(flash());

// app.get("/test", (req, res)=>{
//     res.send("test successful");
// })

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count) req.session.count++;
//     else req.session.count = 1;
//     res.send(`You sent a request ${req.session.count} times`)
// })

app.get("/register", (req, res)=>{
    let { name = "anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error", "failed to register!");
    }else{
        req.flash("Success", "User registered successfully!");
    }
    res.send(req.session.name);
})

app.get("/hello", (req, res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name, msg: req.flash("successMsg"), msg: req.flash("errorMsg")});
})

app.listen(3030, () =>{
    console.log("Server is listning to port 3000")
})