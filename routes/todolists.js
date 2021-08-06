const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const todolists = require('../controllers/todolists');

const {isLoggedIn} = require('../middleware');

router.route('/')
    .get(isLoggedIn, catchAsync(todolists.allTodoLists))

router.route('/:id')
    .get(isLoggedIn, catchAsync(todolists.usersTodoList))
    .post(isLoggedIn, catchAsync(todolists.createTodoItem))

router.route('/:id/cal')
    .get(isLoggedIn, catchAsync(todolists.userTodoListCalView))

module.exports = router;