require('dotenv').config();
const express=require('express');
const bodyParser=require("body-parser");
const app=express();
const mongoose = require('mongoose');
const User=require('./models/User');
const Owner=require('./models/Owner');
const passport = require("passport");
const LocalStrategy = require("passport-local");

//Import Routes
const authRoute=require('./routes/auth');

app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
  }));
app.use(bodyParser.json());

// Connect to DB
//connecting to localhost database

/*mongoose.connect("mongodb://localhost:27017/micDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
},()=> console.log('Successfully connected to local database'));*/

mongoose.connect("mongodb+srv://admin-anubhavg:T-0101@myfirstdatabase.ewcnv.mongodb.net/reservationDB",
{useNewUrlParser:true,
useUnifiedTopology:true},
()=> console.log('Successfully connected to cloud database'));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


// ejs
const ejs = require("ejs");
const { all } = require('./routes/auth');
app.set('view engine','ejs');
app.use(express.static( __dirname + "/public"));
// ejs

app.use(require("express-session")({
	secret: "ONLINERESERVATIONPORTAL",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Owner.authenticate()));
passport.serializeUser(Owner.serializeUser());
passport.deserializeUser(Owner.deserializeUser());

//Route Middleware
app.use(authRoute);

app.get("/",function(req,res){
	res.render("home",{isAdded: false});
});

app.get("/home/:ans",function(req,res){
	res.render("home",{isAdded: req.params.ans});
});

app.post("/saveDetails",function(req,res){
	const user = new User({
        name: req.body.name,
		username: req.body.email,
		phone_no: req.body.phone_no,
		no_of_guests: req.body.no_of_guests,
		reservation_type: req.body.r_type,
		special_requirement: req.body.special_r
	  });
	user.save(function(err,result){
		if(err){
			console.log(err);
			res.redirect("/home/false");
		}
		else{
			console.log(result);
			res.redirect("/home/true");
		}
	});
});

app.get("/owner/profilePage",async function(req,res){
	const allUsers=await User.find({});
	console.log(allUsers);
	res.render("profile",{array:allUsers});
});

app.post("/delete/:user_id",function(req,res){
	User.findByIdAndDelete(req.params.user_id, function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Deleted : ", docs); 
	}
	});
	console.log("Successfully deleted the document");
	res.redirect("/owner/profilePage");  
});

app.post("/edit/:user_id",async function(req,res){
	const user=await User.findById(req.params.user_id);
	res.render("edit",{userId:req.params.user_id,name:user.name,username:user.username,phone:user.phone_no,guests:user.no_of_guests,reservation:user.reservation_type,special:user.special_requirement});
});

app.post("/saveEdit/:user_id",async function(req,res){
	User.findByIdAndUpdate(req.params.user_id, { name: req.body.name, username: req.body.username,phone_no:req.body.phone,no_of_guests:req.body.guests,reservation_type:req.body.reservation,special_requirement:req.body.special}, 
                            function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Updated User : ", docs); 
    } 
	});
	console.log("Successfully edited the document");
	res.redirect("/owner/profilePage"); 	
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Server started on port 3000");
});