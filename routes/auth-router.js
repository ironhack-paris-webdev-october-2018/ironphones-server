const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();


router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  if (!originalPassword || originalPassword.match(/[0-9]/) === null) {
    // "req.flash()" is defined by the "connect-flash" npm package
    // (2 arguments: message type and message text)
    req.flash("error", "Password can't be blank and must contain a number.");
    // redirect to signup page if password is blank or doesn't container a digit
    res.redirect("/signup");
    return; // use "return" instead of a big else
  }

  // encrypt the submitted password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })
    .then(userDoc => {
      // "req.flash()" is defined by the "connect-flash" npm package
      // (2 arguments: message type and message text)
      req.flash("success", "Signup success! 😁");
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // search the database for a user with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong
      if (!userDoc) {
        // "req.flash()" is defined by the "connect-flash" npm package
        // (2 arguments: message type and message text)
        req.flash("error", "Incorrect email. 🤦‍♂️");
        res.redirect("/login");
        return; // use "return" instead of a big else
      }

      // check the password
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return FALSE if "originalPassword" is WRONG
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // "req.flash()" is defined by "connect-flash"
        // (2 arguments: message type and message text)
        req.flash("error", "Incorrect password. 🤯");
        // redirect to the login page if the password is wrong
        res.redirect("/login");
      }
      else {
        // "req.logIn()" is a Passport method that calls "serializeUser()"
        // (that saves the USER ID in the session)
        req.logIn(userDoc, () => {
          // "req.flash()" is defined by "connect-flash"
          // (2 arguments: message type and message text)
          req.flash("success", "Login success! 😎");
          // redirect to the home page if the password is CORRECT
          res.redirect("/");
        });
      }
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  // "req.logOut()" is a Passport method that removes the user ID from session
  req.logOut();

  req.flash("success", "Logged out successfully! 👋🏽");
  res.redirect("/");
});


module.exports = router;
