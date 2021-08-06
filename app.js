if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const path = require('path');

// const Topic = require('./models/topic');
// const Todo = require('./models/todo');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const MongoDBStore = require('connect-mongo');

// const {isLoggedIn} = require('./middleware');

const userRoutes = require('./routes/users')
const todoListRoutes = require('./routes/todolists')
const todoItemRoutes = require('./routes/todoItems')
const topicRoutes = require('./routes/topics')


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
app.set('views', path.join(__dirname, 'views'))

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

app.use('/', userRoutes);
app.use('/todoList', todoListRoutes);
app.use('/todoList/:id/todo', todoItemRoutes);
app.use('/topics', topicRoutes);

//Landing page unless logged in
app.get('/', (req, res) => {
    if (req.user) {
        return res.redirect(`/todoList/${req.user._id}`)
    }
    res.render('landing');
})

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