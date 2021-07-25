const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const Todo = require('./models/todo');
const Topic = require('./models/topic');
const User = require('./models/user');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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

app.get('/', catchAsync(async (req, res, next) => {
    console.log("HERE7");
    const todos = await Todo.find({}).populate('topic');
    const topics = await Topic.find({});
    //
    res.render('main', {todos, topics});
}))

app.get('/setup', catchAsync(async (req, res) => {
    const topics = await Topic.find({});
    res.render('setup', {topics})
}))

app.post('/', catchAsync(async (req, res) => {
    //console.log("HERE3");
    const {newTodo} = req.body;
    const todo = new Todo({
        task: newTodo,
        priority: "high",
        status: "New"
    });
    await todo.save();
    // console.log(todo);
    res.redirect('/');
}))

app.post('/topics', catchAsync(async (req, res) => {
    const {topics} = req.body;
    if(!topics) throw new ExpressError('No topic', 400);
    if(topics === "Unknown") throw new ExpressError('Cannot create topic called Unknown', 400);

    const topicId = await Topic.find({name:topics});
    console.log(topicId);
    if(topicId[0]) throw new ExpressError('Cannot use the same topic name twice', 400);

    console.log(req.body)
    const topic = new Topic({name: topics});
    await topic.save();
    res.redirect('/setup');
}))

app.delete('/topics/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const topic = await Topic.findByIdAndRemove(id);

    res.redirect('/setup');
}))

app.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const todo = await Todo.findByIdAndRemove(id);
    res.redirect('/');
}))


app.put('/edit/:id', catchAsync(async (req, res) => {
    console.log("HERE2");
    const {id} = req.params;

    console.log(req.query);
    let dueDate = req.query.dueDate;
    if (dueDate === "Invalid Date") dueDate=undefined;

    const topicName = req.query.topic;
    const topicId = await Topic.find({name:topicName});
    let topic=undefined;

    if(topicId[0]) topic = topicId[0]._id;
    console.log("Topic Id", topicId)

    const updTodo = {
        task: req.query.q,
        priority: req.query.priority,
        status: req.query.status,
        notes: req.query.notes,
        dueDate: dueDate,
        topic: topic
    }
    console.log(updTodo)
    const todo = await Todo.findByIdAndUpdate(id, updTodo, {omitUndefined:true});

    res.send("Success");
}))

app.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const todo = await Todo.findById(id);
    res.send(todo);
    console.log(todo);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).send(message);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})