const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Comment', CommentSchema);