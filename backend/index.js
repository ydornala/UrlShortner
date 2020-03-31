import passport from 'passport';
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/environment');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { SERVE_HOSTNAME, SERVE_PORT } = require('../src/config.json');
const cookieSession = require('cookie-session');
const { v4: uuid } = require('uuid')
// require('dotenv-safe').config({
//   allowEmptyValues: true
// });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose
  .connect(
    config.mongo.uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

const app = express();

app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}))


app.use(function(req, res, next) {
  req.session.id = (req.session.id || uuid());
  res.header('Access-Control-Allow-Origin', '*');
  next(); // pass control to the next handler
});

app.use('/', require('./api/Code'));
app.use('/api/links', require('./api/Links'));
app.use('/auth', require('./auth').default);

app.listen(
  SERVE_PORT, 
  SERVE_HOSTNAME,
  ()=> console.log(`Shortlinks backend listening on ${SERVE_HOSTNAME}:${SERVE_PORT}!`)
)