const express = require('express');
const multer = require('multer');
const path = require('path');
const responseHandler = require('../utils/responseHandler');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `file_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/single', upload.single('file'), (req, res) => {
  if (!req.file) return responseHandler.error(res, 'No file uploaded', 400);
  const fileUrl = `/uploads/${req.file.filename}`;
  return responseHandler.success(res, { url: fileUrl }, 'File uploaded successfully.', 201);
});

module.exports = router;
