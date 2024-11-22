// helper.js
import * as faceapi from 'face-api.js';

// Function to load models
export const loadModels = async (MODEL_URL) => {
  try {
    console.log("Loading face-api.js models...");
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Models loaded successfully");
  } catch (error) {
    console.error("Error loading models:", error);
  }
};

// Function to detect faces and return the face descriptor
export const detectFace = async (imageElement) => {
  const detections = await faceapi.detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (detections) {
    return detections;
  } else {
    console.log('No face detected');
    return null;
  }
};

// Function to compare face descriptors
export const compareFaceDescriptors = (descriptor1, descriptor2) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const THRESHOLD = 0.6; // Set your threshold for matching
  return distance < THRESHOLD;
};
