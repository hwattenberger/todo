const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const todoitems = require('../controllers/todoItems');


const {isLoggedIn} = require('../middleware');

router.route('/:todoId')
    .delete(isLoggedIn, catchAsync(todoitems.deleteTodo))
    .put(isLoggedIn, catchAsync(todoitems.editTodo))

module.exports = router;