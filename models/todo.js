const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: String,
    priority: String,
    dueDate: Date,
    status: String,
    notes: String,
    topic: String
})

module.exports = mongoose.model('Todo', TodoSchema);