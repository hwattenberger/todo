
const User = require('../models/user');
const Topic = require('../models/topic');
const Todo = require('../models/todo');

module.exports.allTodoLists = async (req, res, next) => {
    const users = await User.find({public: {$ne: false}})

    res.render('allUsers', {users});
}

module.exports.usersTodoList = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path:'todos',
        populate: [{
            path:'topic'
        }, {
            path:'createdBy'
        }]
    })
    
    const topics = await Topic.find({user: id})

    res.render('main', {user, topics});
}

module.exports.createTodoItem = async (req, res) => {
    const {newTodo} = req.body;
    const {id} = req.params;

    const user = await User.findById(id)

    const todo = new Todo({
        task: newTodo,
        priority: "high",
        status: "New",
        createdBy: req.user._id
    });

    user.todos.push(todo);

    await todo.save();
    await user.save();
    
    res.redirect(`/todoList/${id}`);
}

module.exports.userTodoListCalView = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path:'todos',
        populate: [{
            path:'topic'
        }, {
            path:'createdBy'
        }]
    })

    res.render('calendar', {user})
}