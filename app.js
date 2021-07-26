const express = require('express');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const path = require('path');
const Todo = require('./models/todo');
const Topic = require('./models/topic');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const MongoDBStore = require('connect-mongo');

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

const secret = process.env.SECRET || 'Notagoodsecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret
    },
    touchAfter: 24 * 60 * 60    //This is in seconds
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/createUser', async (req, res) => {
//     const user = new User({username: "Bob"})
//     const newUser = await User.register(user, 'password');
//     res.send(newUser);
// })

app.get('/landing', (req, res) => {
    res.render('landing');
})

app.get('/todo/:id', async (req, res) => {
    const {id} = req.params;
    const todo = await Todo.findById(id);

    console.log("Found todo", todo)

    res.send(todo);
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username})
    const newUser = await User.register(user, password);

    req.login(newUser, err => {
        if(err) return next(err);
        // req.flash('success', "Welcome to YelpCamp!");
        res.redirect('/');
    });
    }
    catch (e) {
        // req.flash('error', e.message);
        res.redirect('register');
    }
})

app.get('/cal', async (req, res) => {
    const todos = await Todo.find({status: 'New'}).populate('topic');

    res.render('calendar', {todos})
})

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