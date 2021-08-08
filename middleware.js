const Todo = require('./models/todo');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in')
        return res.redirect('/login');
    } else {
        // console.log("Logged in");
        next();
    }
}

module.exports.userCreatedTodo = async(req, res, next) => {
    const {id, todoId} = req.params;
    const editedTodo = await Todo.findById(todoId);

    console.log(id, req.user._id)
    if(!editedTodo.createdBy.equals(req.user._id) && id!=req.user._id) {
        // console.log("NOT CREATED", editedTodo.createdBy, req.user._id);
        req.flash('error', 'You cannot edit a todo if you did not create it');
        res.status(302);
        // console.log("hi", req);
        // res.redirect(`/todoList/${id}`);
        if(req.method === "DELETE") {
            return res.redirect(`/todoList/${id}`);
        }
        else {
            return res.send('Error');
        }
    }
    next();
}