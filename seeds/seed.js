const mongoose = require('mongoose');
const Todo = require('../models/todo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/todoApp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const todoArray = [{
    task: "Walk Dog",
    priority: "high",
    dueDate: new Date(2021, 9, 1),
    status: "new",  //new, in-progress, complete
    notes: "This should be done when it's light outside",
}, {
    task: "Feed Nori",
    priority: "high",
    dueDate: new Date(2021, 8, 17),
}, {
    task: "Learn all of Javascript",
    priority: "low",
    dueDate: new Date(2021, 12, 1),
}, {
    task: "Sleep",
    priority: "high",
    dueDate: new Date(2021, 8, 1),
}, {
    task: "Shower",
    priority: "low",
    dueDate: new Date(2021, 9, 23),
}];

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Todo.deleteMany({});

    for (let newtodo of todoArray) {
        const todo = new Todo (newtodo)
        await todo.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})