const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: String,
    priority: String,
    dueDate: Date,
    status: String,
    notes: String,
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ownedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Todo', TodoSchema);