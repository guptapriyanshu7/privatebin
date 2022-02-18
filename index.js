const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

let PORT = 3000;
let MONGO_URI = 'mongodb://127.0.0.1/polynomial';

if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PORT;
  MONGO_URI = process.env.MONGO_URI;
}

mongoose.connect(MONGO_URI).then((_) => {
  console.log('Connected to MongoDB');
});

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
