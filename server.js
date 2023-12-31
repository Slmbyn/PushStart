const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//adding method-override below logger
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();
require('./config/database');

require('./config/passport');

const indexRouter = require('./routes/index');
const vehiclesRouter = require('./routes/vehicles')
const myCarsRouter = require('./routes/myCars')
const transactionsRouter = require('./routes/transaction')


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Add this middleware BELOW passport middleware
app.use(function (req, res, next) {
	res.locals.user = req.user;
  next();
});

//mounting methodoverride (changes some post request to delete or update)
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/myCars', myCarsRouter);
app.use('/', transactionsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
