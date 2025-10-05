const Task = require('../models/Task');

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id, isDeleted: false })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };