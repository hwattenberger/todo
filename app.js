const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const Todo = require('./models/todo');
const methodOverride = require('method-override');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/todoApp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    console.log("HERE7");
    const todos = await Todo.find({});
    //
    res.render('main', {todos});
})

app.post('/', async (req, res) => {
    console.log("HERE3");
    const {newTodo} = req.body;
    const todo = new Todo({
        task: newTodo,
        priority: "high",
        status: "New"
    });
    await todo.save();
    // console.log(todo);
    res.redirect('/');
})

app.delete('/:id', async (req, res) => {
    console.log("HERE?");
    const {id} = req.params;
    const todo = await Todo.findByIdAndRemove(id);
    res.redirect('/');
})


app.put('/edit/:id', async (req, res) => {
    console.log("HERE2");
    const {id} = req.params;

    console.log(req.query);
    let dueDate = req.query.dueDate;
    if (dueDate === "Invalid Date") dueDate=undefined;

    const updTodo = {
        task: req.query.q,
        priority: req.query.priority,
        status: req.query.status,
        notes: req.query.notes,
        dueDate: dueDate
    }
    const todo = await Todo.findByIdAndUpdate(id, updTodo, {omitUndefined:true});

    res.send("Success");
})

app.get('/:id', async (req, res) => {
    const {id} = req.params;
    const todo = await Todo.findById(id);
    res.send(todo);
    console.log(todo);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})