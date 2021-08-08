const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const todoitems = require('../controllers/todoItems');


const {isLoggedIn, userCreatedTodo} = require('../middleware');

router.route('/:todoId')
    .delete(isLoggedIn, userCreatedTodo, catchAsync(todoitems.deleteTodo))
    .put(isLoggedIn, userCreatedTodo, catchAsync(todoitems.editTodo))
    .get(isLoggedIn, catchAsync(todoitems.getTodo))

router.route('/checkOwner/:todoId')
    .get(isLoggedIn, userCreatedTodo, catchAsync(todoitems.getTodo))

module.exports = router;