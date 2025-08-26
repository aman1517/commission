const File = require('../models/fileupload');
const fs = require('fs');

// POST /api/files
exports.uploadFile = async (req, res) => {
    console.log(req,"req");
    
  try {
    // If no file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save file metadata to DB
    const fileData = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size,
     
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileData
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
};

// GET /api/files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files' });
  }
};

// GET /api/files/:id
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching the file' });
  }
};

// DELETE /api/files/:id
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file from disk
    fs.unlinkSync(file.filePath);

    // Delete record from DB
    await File.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting the file' });
  }
};

