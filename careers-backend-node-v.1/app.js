var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: path.join(__dirname, '.env') });
var axios = require('axios');

var mongoose = require('mongoose');
const database_url = process.env.DATABASE_URI;

var authRouter = require('./routes/authRouter');
var indexRouter = require('./routes/index');
var servicesRouter = require('./routes/servicesRouter');
var stepsRouter = require('./routes/stepsRouter');
var usersRouter = require('./routes/usersRouter');
var universitiesRouter = require('./routes/universitiesRouter');
var pathsRouter = require('./routes/pathRouter')
var userpathRouter = require('./routes/userpathRouter')
var cors = require("cors");
const preLoginRouter = require('./routes/preLoginRouter');
var QuestionRouter = require('./routes/questionRouter')
var userPersonalityRouter = require('./routes/userPersonalityRouter')
var partnerRouter = require('./routes/partnerRouter')
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// set the body parser to handle urlencoded data
app.use(bodyParser.json());
app.use('/services', servicesRouter);
app.use('/steps', stepsRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/universities', universitiesRouter)
app.use('/paths', pathsRouter)
app.use('/userpaths', userpathRouter)
app.use('/pre_login', preLoginRouter)
app.use('/question', QuestionRouter)
app.use('/userAnswers', userPersonalityRouter)
app.use('/partner', partnerRouter)


//Increase body size limit to 50mb to prevent error: request entity too large(413)
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

// set the body parser to handle json data
// app.use(bodyParser.json({
//   limit: '10mb' // set the limit to 10 megabytes
// }));
// console.log("inside server")
app.use(express.json({ limit: '50mb' }));

app.get('/api/places', async (req, res) => {
  const apiKey = 'AIzaSyB5MJ2jMHzl_ghkbxOsyPmeBmYw_sUsIRQ';
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.query.place_id}&key=${apiKey}`;

  try {
    const apiResponse = await axios.get(apiUrl);
    const data = apiResponse.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});












// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mongodb conncetion with the database_uri
// mongoose.set('useCreateIndex', true)
mongoose.connect(database_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the Database');
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
