const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

router.post('/', protect, createComment);
router.get('/:taskId', protect, getComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;