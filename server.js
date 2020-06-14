'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', { users: users });
};

const handleProfilePage = (req, res) => {
  let _id = req.params._id;

  let userProfile = users.find((user) => {
    return user._id === _id;
  });

  if (!userProfile) {
    res.status(404).send("I couldn't find what you're looking for.");
  };

  let userFriends = userProfile.friends.map((id) => {
    return users.find((user) => {
      return user._id === id;
    });
  });

  res.status(200).render("pages/profile", {
    user: userProfile,
    friends: userFriends,
  });
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomepage)
  .get('/users/:_id', handleProfilePage)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
