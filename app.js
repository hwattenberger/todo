if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const path = require('path');

const Topic = require('./models/topic');
const Todo = require('./models/todo');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const MongoDBStore = require('connect-mongo');

const {isLoggedIn} = require('./middleware');
const todo = require('./models/todo');

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Landing page unless logged in
app.get('/', (req, res) => {
    if (req.user) {
        return res.redirect(`/todoList/${req.user._id}`)
    }
    res.render('landing');
})

//////
//User activities
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', catchAsync(async (req, res) => {
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
}))

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', "Logged In");
    res.redirect('/');
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged Out");
    res.redirect('/');
})

app.put('/setup', catchAsync(async (req, res) => {
    // const theme = req.query.theme;
    // const toggled = req.query.toggled;
    const {theme, public} = req.query;
    // const user = await User.findById(req.user._id);

    const userUpdate = {
        defaultView: theme,
        public: public
    }
    const user = await User.findByIdAndUpdate(req.user._id, userUpdate, {omitUndefined:true});

    // console.log("Test", user)
    res.send("Success");
}))

////

//User setup
app.get('/setup', catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const topics = await Topic.find({user: req.user._id})
    res.render('setup', {user, topics})
}))

//All users - todos
app.get('/todoList', catchAsync(async (req, res, next) => {
    const users = await User.find({public: {$ne: false}})

    res.render('allUsers', {users});
}))

//Get user's todo list
app.get('/todoList/:id', catchAsync(async (req, res, next) => {
    // console.log("Single User's Todo List ");
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

    // console.log("HERE?", user);
    // console.log("Topics", topics)
    //
    res.render('main', {user, topics});
}))

//Create new single todo
app.post('/todoList/:id', catchAsync(async (req, res) => {
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
    // console.log("Created", user);
    
    res.redirect(`/todoList/${id}`);
}))

//Calandar view for a todo list
app.get('/todoList/:id/cal', catchAsync(async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path:'todos',
        populate: [{
            path:'topic'
        }, {
            path:'createdBy'
        }]
    })
    // const todos = await Todo.find({status: 'New'}).populate('topic');

    res.render('calendar', {user})
}))

//Get info about single todo
app.get('/todo/:todoId', catchAsync(async (req, res) => {
    const {todoId} = req.params;
    const todo = await Todo.findById(todoId);

    // console.log("Found todo", todoId)

    res.send(todo);
}))

//Delete a todo item
app.delete('/todoList/:id/item/:todoId', catchAsync(async (req, res) => {
    const {id, todoId} = req.params;

    const todo = await Todo.findByIdAndRemove(todoId);
    const user2 = await User.findByIdAndUpdate(id, {$pull: {todos: todoId}})

    // console.log("user", user2)

    res.redirect('/');
}))

//Edit a todo item
app.put('/todoList/:id/todo/:todoId', catchAsync(async (req, res) => {
    // console.log("HERE2");
    const {todoId, id} = req.params;

    // console.log(req.query);
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

    // console.log("Topic name:", topicId)

    const updTodo = {
        task: req.query.q,
        priority: req.query.priority,
        status: req.query.status,
        notes: req.query.notes,
        dueDate: dueDate,
        topic: topicId
    }
    // console.log("HERE4", updTodo)
    const todo = await Todo.findByIdAndUpdate(todoId, updTodo, {omitUndefined:true});
    // console.log("HERE5", todo)
    res.send("Success");
}))

//Create new topic
app.post('/topics', catchAsync(async (req, res) => {
    const {topics} = req.body;

    if(!topics) throw new ExpressError('No topic', 400);
    if(topics === "Unknown") throw new ExpressError('Cannot create topic called Unknown', 400);

    const newTopic = new Topic({
        name: topics,
        user: req.user._id
    })
    
    await newTopic.save();
    res.redirect('/setup');
}))

//Delete a topic
app.delete('/topics/:topicId', catchAsync(async (req, res) => {
    const {topicId} = req.params;
 
    const topic = await Topic.findById(topicId)
    await topic.remove();

    res.redirect('/setup');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message="Oh No, Something Went Wrong."
    res.status(statusCode).render('error', {err});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port 3000");
})