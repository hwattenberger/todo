const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Topic = require('../models/topic');
const topic = require('../controllers/topics');

const {isLoggedIn} = require('../middleware');


//Create new topic
router.route('/')
    .post(isLoggedIn, catchAsync(topic.newTopic))

//Delete a topic
router.route('/:topicId')
    .delete(isLoggedIn, catchAsync(topic.deleteTopic))

module.exports = router;