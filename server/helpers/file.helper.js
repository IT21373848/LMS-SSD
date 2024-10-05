import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Set file size limit to 5MB
const limits = {
    fileSize: 5 * 1024 * 1024 // 5 MB in bytes
};

export const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: limits 
});
