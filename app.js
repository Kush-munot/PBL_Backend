const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors({
    origin: [
        'http://localhost:5173',
    ]
}));

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        // Use the original file name
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up a route for file upload
app.post('/upload', upload.single('image'), (req, res) => {
    // Split originalname on "_" and send last two values in the response
    // const fileNameParts = req.file.originalname.split('_');
    // const lastTwoValues = fileNameParts.slice(1, 3);

    // res.json({ lastTwoValues });
    
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
