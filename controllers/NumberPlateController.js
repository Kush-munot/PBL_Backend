const Tesseract = require('tesseract.js');

function recognizeNumberPlate(imagePath) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(
            imagePath,
            'eng', // Language code for English
            {
                logger: (info) => {
                    if (info.status === 'recognizing text') {
                        console.log(`Progress: ${info.progress}%`);
                    }
                },
            }
        )
            .then(({ data: { text } }) => {
                // Extracted text contains the recognized number plate
                const numberPlate = text.trim();
                resolve(numberPlate);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Example usage:
const imagePath = './uploads/*';

recognizeNumberPlate(imagePath)
    .then((numberPlate) => {
        console.log('Number Plate Recognition Result:', numberPlate);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
