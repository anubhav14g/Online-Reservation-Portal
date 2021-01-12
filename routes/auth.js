const router=require('express').Router();
const User=require('../models/User');
const Owner=require('../models/Owner');
const passport = require("passport");

//Register Route

router.get("/owner/register",function(req,res){
    res.render("register");
});

router.post("/owner/register",(req,res) =>{
    Owner.register({
        name: req.body.name,
        username: req.body.username
      }, req.body.password, function(err, owner) {
        if (err) {
          res.redirect("/owner/register");
        } else {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/owner/login/true");
          });
        }
      });
});

//Login Route

router.get("/owner/login/:ans",function(req,res){
    res.render("login",{isAdded:req.params.ans});
});

router.get("/owner/login",function(req,res){
    res.render("login",{isAdded:false});
});

router.post('/owner/login',function(req, res, next) {
    const owner = new Owner({
        username: req.body.username,
        password: req.body.password
      });
      req.login(owner, function(err) {
        if (!err) {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/owner/profilePage");
          });
        }
        else{
          console.log(err);
          res.redirect("/login");
        }
      });    
});


//user logout
router.get("/owner/logout",function(req,res){
	req.logout();
  res.redirect("/");
});

module.exports=router;