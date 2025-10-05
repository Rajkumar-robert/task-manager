const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileType: { type: String },
  fileSize: { type: Number }
});

module.exports = mongoose.model('File', FileSchema);
