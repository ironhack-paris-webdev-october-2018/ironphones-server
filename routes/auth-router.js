const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();


router.post("/signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  if (!originalPassword || originalPassword.match(/[0-9]/) === null) {
    // show error JSON if password is empty or doesn't have a number
    next(new Error("Password can't be blank and must contain a number."));
    return;
  }

  // encrypt the submitted password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })
    .then(userDoc => {
      // Log in the user automatically when they sign up
      req.logIn(userDoc, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // search the database for a user with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong
      if (!userDoc) {
        next(new Error("Incorrect email. 🤦‍♂️"));
        return; // use "return" instead of a big else
      }

      // check the password
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return FALSE if "originalPassword" is WRONG
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        next(new Error("Incorrect password. 🤯"));
      }
      else {
        // "req.logIn()" is a Passport method that calls "serializeUser()"
        // (that saves the USER ID in the session)
        req.logIn(userDoc, () => {
          // hide "encryptedPassword" before sending the JSON (it's a security risk)
          userDoc.encryptedPassword = undefined;
          res.json({ userDoc });
        });
      }
    })
    .catch(err => next(err));
});

router.delete("/logout", (req, res, next) => {
  // "req.logOut()" is a Passport method that removes the user ID from session
  req.logOut();

  // send empty "userDoc" when you log out
  res.json({ userDoc: null });
});

// GET "/checkuser" allows the client to check to see:
// (a) if we are logged-in
// (b) what are the details of the logged-in user
router.get("/checkuser", (req, res, next) => {
  if (req.user) {
  // hide "encryptedPassword" before sending the JSON (it's a security risk)
    req.user.encryptedPassword = undefined;
    res.json({ userDoc: req.user });
  }
  else {
    res.json({ userDoc: null });
  }
});


module.exports = router;
