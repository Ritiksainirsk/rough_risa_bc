const multer = require('multer');

// Use memory storage instead of disk storage for Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 5 // Maximum 5 files
    }
});

module.exports = upload;
