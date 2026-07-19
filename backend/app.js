var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require("cors")
var logger = require('morgan');
const dotenv = require("dotenv")
dotenv.config()
const connectdb = require("./config/db")
connectdb()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const interviewRouter = require('./routes/interview.routes')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "https://genai-resume-checker.vercel.app",
  credentials: true
}))

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use("/api/v1/interview",interviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (changed for apierror util)
app.use(function(err, req, res, next) {
  const statusCode = err.statuscode || err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

module.exports = app;
