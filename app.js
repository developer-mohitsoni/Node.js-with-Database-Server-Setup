var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressSession = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");

var personRouter = require("./routes/personRoutes");
var menuRouter = require("./routes/menuItemRoutes");

var bodyParser = require("body-parser");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  expressSession({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "keyboard cat",
  })
);

app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser(personRouter.serializeUser());
// passport.deserializeUser(personRouter.deserializeUser());

app.use(flash());
app.use(bodyParser.json()); // Stores data in req.body

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/person", personRouter);
app.use("/menu", menuRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
