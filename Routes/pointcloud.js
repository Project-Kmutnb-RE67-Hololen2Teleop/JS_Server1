import { Router } from "express";
import multer from 'multer';
import path from 'path';

const PointCloudRouter = Router() ;

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './PointCloudPic/'); // The folder where files will be saved
    },
    filename: (req, file, cb) => {
      // Set the filename to be the original name of the file
      cb(null, file.originalname);
    }
  });
// Initialize multer with the storage configuration
const upload = multer({ storage });

// POST route for uploading files
PointCloudRouter.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    // Access the file through req.file
    console.log('Uploaded file:', req.file);
  
    // Respond with information about the uploaded file
    res.json({
      message: 'File uploaded successfully!',
      file: req.file
    });
  });



export default PointCloudRouter;