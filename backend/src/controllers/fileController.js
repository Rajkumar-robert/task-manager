const File = require('../models/File');
const path = require('path');
const fs = require('fs');

const uploadFile = async (req, res, next) => {
  try {
    console.log('Uploaded files:', req.files);
    const taskId = req.body.taskId;
    if (!taskId || !req.files) return res.status(400).json({ message: 'taskId and file required' });

    const filesData = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      task: taskId,
      uploadedBy: req.user._id,
      fileType: file.mimetype,
      fileSize: file.size
    }));

    const files = await File.insertMany(filesData);
    res.status(201).json(files);
  } catch (err) {
    next(err);
  }
};

const getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ task: req.params.taskId });
    res.json(files);
  } catch (err) {
    next(err);
  }
};


const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    res.download(filePath, file.originalName);
  } catch (err) {
    next(err);
  }
};


const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found or not yours' });

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    fs.unlink(filePath, err => {
      if (err) console.warn('Could not delete file from disk:', err.message);
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile };
