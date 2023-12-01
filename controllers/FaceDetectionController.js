const cv = require('opencv4nodejs');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function detectAndRecognizeFaces(imagePath, modelPath) {
    // Load the image
    const image = await cv.imreadAsync(imagePath);

    // Load face-api.js models
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

    // Detect faces using OpenCV
    const faceRects = await faceapi.detectAllFaces(image.toBuffer(), new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();

    const faceDescriptors = faceRects.map((faceRect) => faceRect.descriptor);

    // Recognize faces
    const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors('label', faceDescriptors);

    // Example: Match the recognized face against a known face
    const knownDescriptors = [labeledFaceDescriptors];
    const recognizer = new faceapi.FaceMatcher(knownDescriptors);

    // Match the detected faces against known faces
    const matches = faceRects.map((faceRect) => recognizer.findBestMatch(faceRect.descriptor));

    // Output results
    const result = matches.map((match, index) => ({
        label: match.label,
        distance: match.distance,
        faceRect: {
            x: faceRects[index].detection.box.x,
            y: faceRects[index].detection.box.y,
            width: faceRects[index].detection.box.width,
            height: faceRects[index].detection.box.height,
        },
    }));

    return result;
}

// Example usage:
const imagePath = './uploads/*';
const modelPath = './models/models.js';

detectAndRecognizeFaces(imagePath, modelPath)
    .then((result) => {
        console.log('Face detection and recognition result:', result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
