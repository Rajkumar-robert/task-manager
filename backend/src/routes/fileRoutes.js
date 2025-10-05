const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile, getFiles, downloadFile, deleteFile } = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', protect, upload.array('files', 5), uploadFile);
router.get('/:taskId', protect, getFiles);
router.get('/download/:id', protect, downloadFile);
router.delete('/:id', protect, deleteFile);

module.exports = router;
