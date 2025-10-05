const Task = require('../models/Task');

const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusStats, priorityStats] = await Promise.all([
      Task.aggregate([
        { $match: { createdBy: userId, isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { createdBy: userId, isDeleted: false } },
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ])
    ]);

    res.json({ statusStats, priorityStats });
  } catch (err) {
    next(err);
  }
};

const getTaskTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const trends = await Task.aggregate([
      { $match: { createdBy: userId, isDeleted: false } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formatted = trends.map(t => ({
      month: t._id,
      count: t.count
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTaskStats, getTaskTrends };