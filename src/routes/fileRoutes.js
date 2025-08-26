const express = require('express');
const { uploadFile, getAllFiles, getFileById, deleteFile } = require('../controllers/fileController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get("/", getAllFiles);           // Get all
router.get("/:id", getFileById);        // Get one by ID
router.post("/", upload.single('file'), uploadFile);
router.delete("/:id", deleteFile);

module.exports = router;
