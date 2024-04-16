const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Person = require("../models/Person");

passport.use(
  new LocalStrategy(async (Username, Password, done) => {
    // authentication logic here

    try {
      console.log("Received Credentials: ", Username, Password);

      const user = await Person.findOne({ username: Username });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isPasswordMatch = user.password === Password ? true : false;

      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;