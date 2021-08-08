const User = require('../models/user');
const Topic = require('../models/topic');
const Todo = require('../models/todo');

module.exports.deleteTodo = async (req, res) => {
    const {id, todoId} = req.params;

    const todo = await Todo.findByIdAndRemove(todoId);
    const user2 = await User.findByIdAndUpdate(id, {$pull: {todos: todoId}})

    res.redirect('/');
}

module.exports.editTodo = async (req, res) => {
    const {todoId, id} = req.params;

    let dueDate = req.query.dueDate;
    if (dueDate === "Invalid Date") dueDate=undefined;

    const topicName = req.query.topic;
    let newTopic=""

    if (topicName) {
        newTopic = await Topic.findOne({name: topicName}, {user: id})
    }

    let topicId=""
    if (newTopic === null) topicId = null;
    else topicId=newTopic._id

    const updTodo = {
        task: req.query.q,
        priority: req.query.priority,
        status: req.query.status,
        notes: req.query.notes,
        dueDate: dueDate,
        topic: topicId
    }

    const todo = await Todo.findByIdAndUpdate(todoId, updTodo, {omitUndefined:true});

    res.send("Success");
}

module.exports.getTodo = async (req, res) => {
    const {todoId, id} = req.params;

    const todo = await Todo.findById(todoId)

    res.send(todo);
}