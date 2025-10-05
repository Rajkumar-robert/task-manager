const Comment = require('../models/Comment');

const createComment = async (req, res, next) => {
  try {
    const { text, taskId } = req.body;
    if (!text || !taskId) return res.status(400).json({ message: 'Text and taskId required' });

    const comment = await Comment.create({
      text,
      task: taskId,
      createdBy: req.user._id
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { text: req.body.text },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment not found or not yours' });
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found or not yours' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createComment, getComments, updateComment, deleteComment };