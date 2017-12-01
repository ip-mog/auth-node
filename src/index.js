const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb://localhost:27017/auth');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const userSchema = mongoose.Schema({
  name: String,
  password: String,
})

const User = mongoose.model('User', userSchema);

app.post('/users/add', (req, res) => {
  if (!req.body.name || !req.body.password) {
    res.status(400).json({
      success: false,
      message: 'Failed'
    });
  } else {
    User.create({
      name: req.body.name,
      password: req.body.password,
    }, (err, doc) => {
      if (err) {
        res.json({
          success: false,
          message: 'Failed'
        })
      } else {
        res.json({
          user: doc,
          success: true,
          message: 'User was created',
        });
      }
    })
  }
})

app.get('/users', (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send(docs);
    }
  })
})

app.listen(3000, () => {
  console.log('Server started');
})