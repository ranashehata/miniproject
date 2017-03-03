
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var profile = require('../models/profile');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});


//viewprofile
router.get('/viewprofile', function(req, res){
	res.render('viewprofile');
});


//create profile
router.get('/createprofile', function(req, res){
	res.render('createprofile');
});

// create a profile
router.post('/createprofile', function(req, res){
	
	var name = req.body.name;
	var LinkToWork= req.body.LinkToWork;
	var fileupload= req.body.fileupload;
	

	// Validation

	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('LinkToWork', 'atleast 1 work is required').notEmpty();
	req.checkBody('fileupload', 'atleast 1 work is required').notEmpty();
	

	var errors = req.validationErrors();


	if(errors){
		res.render('createprofile',{
			errors:errors
		});
	} else {
		var newprofile = new profile({
		
		name: name,
		LinkToWork:LinkToWork,
		fileupload:fileupload
		});

		profile.createprofile(newprofile, function(err, profile){
			if(err) throw err;
			console.log(profile);
		});

		req.flash('success_msg', 'You have created a profile successfully');

		res.redirect('/users/viewprofile');
	}
});



///////////////////////////////////////////////////////////////////////////////
// Register User
router.post('/register', function(req, res){
	
	var username = req.body.username;
	var password = req.body.password;
	

	// Validation

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
		
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});





module.exports = router;