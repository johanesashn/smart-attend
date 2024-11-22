// "use client"

// import { useEffect, useRef, useState } from 'react'
// import * as faceapi from 'face-api.js'
// import axios from 'axios' // Import Axios
// import { useRouter } from "next/navigation";
// import { Divider, Alert } from '../components';
// import Link from 'next/link';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import '@tensorflow/tfjs';

// export default function Home() {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [base64Image, setBase64Image] = useState('')
//   const videoRef = useRef() // Reference for the video element
//   const canvasRef = useRef() // Reference for the canvas element
//   const streamRef = useRef() // Reference for the MediaStream
//   const attendRef = useRef() // Reference for the MediaStream
//   const [user, setUser] = useState({})
//   const router = useRouter()
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [currentDate, setCurrentDate] = useState({
//     day: '',
//     month: '',
//     year: '',
//   });
//   const [attendSubject, setAttendSubject] = useState(null)
//   const [loadSubject, setLoadSubject] = useState(false)
//   const [alert, setAlert] = useState({
//     description: "", 
//     type: ""
//   })
//   const [faceModel, setFaceModel] = useState(false)

//   const fetchPhoto = async (userId) => {
//     try {
//       const response = await axios.get(`/api/photos/${userId}`) // Use Axios to fetch photo
//       setBase64Image(`data:image/png;base64,${response.data.photo}`)
//     } catch (error) {
//       console.error("Error fetching photo:", error)
//       setError("Error fetching photo")
//     }
//   }

//   const redirect = async (id) => {
//       const res = await axios.get(`/api/users/${id}`)
//       if (res.data.user.role !== "student"){
//         router.push('/dashboard')
//       }
//   }

//   const getUser = async (userId) => {
//     try {
//       const response = await axios.get(`/api/users/${userId}`) // Use Axios to fetch user
//       setUser(response.data.user)
//     } catch (error) {
//       setError("Error fetching user data")
//     }
//   }
  
//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
//     videoRef.current.srcObject = stream // Set the video source to the webcam stream
//     streamRef.current = stream // Store the stream reference
//   }

//   const stopVideo = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop() // Stop each track to turn off the camera
//       })
//     }
//   }

//   const removeCanvas = () => {
//     const existingCanvas = document.querySelector('canvas') // Select the canvas element
//     if (existingCanvas) {
//       existingCanvas.remove() // Remove the canvas from the DOM
//     }
//   }

//   const attend = async () => {
//     try {
//       const res = await axios.put(`/api/subjects/${attendSubject.name}`, {
//         type: "attend", 
//         studentId: user.id
//       })
//       console.log(res)
//       setAlert({
//         type: "success", 
//         description: "You have been attended"
//       })
//       setTimeout(() => {
//         setAlert({description: "", type: ""})
//       }, 3000);
//     } catch (error) {
//       setAlert({
//         type: "danger", 
//         description: "Something error happened"
//       })
//       setTimeout(() => {
//         setAlert({description: "", type: ""})
//       }, 3000);
//     }
//   }

//   const captureImage = async () => {
//     // Create a canvas and draw the video frame onto it
//     const canvas = faceapi.createCanvas(videoRef.current)
//     canvasRef.current = canvas
  
//     // Remove any existing canvas element to ensure only the latest image is displayed
//     removeCanvas()
  
//     if (attendRef.current){
//       attendRef.current.appendChild(canvas) // Attach the new canvas to the DOM
//     }
  
//     const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight }
//     faceapi.matchDimensions(canvas, displaySize)
  
//     const context = canvas.getContext('2d')
//     context.drawImage(videoRef.current, 0, 0, displaySize.width, displaySize.height) // Draw the video frame
  
//     // Detect faces
//     try {
//       const dataUrl = canvas.toDataURL() // Get data URL from the canvas
//       const blob = await fetch(dataUrl).then(res => res.blob()) // Convert data URL to Blob
//       const img = await faceapi.bufferToImage(blob) // Use Blob instead of data URL
  
//       const detections = await faceapi
//         .detectAllFaces(img)
//         .withFaceLandmarks()
//         .withFaceDescriptors()
  
//       const resizedDetections = faceapi.resizeResults(detections, displaySize)
//       const labeledFaceDescriptors = await loadLabeledImages()
//       const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
  
//       const results = resizedDetections.map((d) =>
//         faceMatcher.findBestMatch(d.descriptor)
//       )
  
//       // Update the detected label state with the first detection's result
//       if (results.length > 0) {
//         if (results[0]._label === "unknown"){
//           setAlert({
//             type: "danger", 
//             description: "Face doesn't match"
//           })
//           setTimeout(() => {
//             setAlert({description: "", type: ""})
//           }, 3000);
//         } else {
//           attend()
//         }
//       } else {
//         setAlert({
//           type: "danger", 
//           description: "No Face Detected"
//         })
//         setTimeout(() => {
//           setAlert({description: "", type: ""})
//         }, 3000);
//       }
  
//       // Optional: Draw boxes around detected faces
//       results.forEach((result, i) => {
//         if (resizedDetections[i]) { // Check if there is a valid detection
//           const box = resizedDetections[i].detection.box
//           const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//           drawBox.draw(canvas)
//         }
//       })
//     } catch (error) {
//       console.error("Error capturing or processing the image:", error) // Log any errors
//     }
//   }
  
//   const loadLabeledImages = async () => {
//     const descriptions = []
//     for (let i = 1; i <= 2; i++) {
//       try {
//         // get the image
//         const img = await faceapi.fetchImage(base64Image)
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         if (detections) {
//           descriptions.push(detections.descriptor)
//         } else {
//           console.error(`No face detected in labeled image for ${user.name}`)
//         }
//       } catch (error) {
//         console.error(`Error loading images for ${user.name}:`, error)
//       }
//     }
//     return new faceapi.LabeledFaceDescriptors(user.name, descriptions)
//   }

//   const getTimeDifferenceInMinutes = (currentTime, subjectTime) => {
//     // Helper function to convert time in hh:mm format to total minutes
//     const timeToMinutes = (time) => {
//       const [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
//       return hours * 60 + minutes; // Calculate total minutes
//     };
    
//     const currentMinutes = timeToMinutes(currentTime); // Convert current time to minutes
//     const subjectMinutes = timeToMinutes(subjectTime); // Convert subject time to minutes
    
//     const difference = Math.abs(currentMinutes - subjectMinutes); // Calculate difference in minutes
    
//     return difference; // Return the difference
//   };
  
//   // Function to get the current time in hh:mm format
//   const getCurrentTime = () => {
//     const date = new Date(); // Create a new Date object
//     const hours = String(date.getHours()).padStart(2, '0'); // Get hours and format as 2 digits
//     const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and format as 2 digits
    
//     return `${hours}:${minutes}`; // Return the time in hh:mm format
//   };

//   const getUserSubjects = async () => {
//     const time = getCurrentTime()
//     const today = currentDate.day.toLowerCase()
//     user?.subjects?.forEach(async subject => {
//       if (today !== "") {
//         try {
//           const res = await axios.get(`/api/subjects/${subject}`)
//           const data = res.data.subject
//           setLoadSubject(true)
//           if (data.day === today){
//             const timeDifference = getTimeDifferenceInMinutes(data.time_start, time)
//             if (timeDifference < 15){
//               console.log(data)
//               setAttendSubject(data)
//             }
//           }
//         } catch (error) {
//           console.log(error)
//         }
//       }
//     })
//   }

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//               console.log(position)
//                 setLocation({
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,
//                 });
//             },
//             (error) => {
//                 console.error("Error getting location:", error);
//             }
//         );
//     } else {
//         console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     getCurrentLocation()
//     const id = sessionStorage.getItem("userId") // Get userId from sessionStorage
    
//     // Fetch user details and photo only if userId is available
//     if (id) {
//       redirect(id)
//       fetchPhoto(id)
//       getUser(id)
//     }

//     if (typeof window !== 'undefined') {
//       const getDate = () => {
//           const today = new Date()
//           const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
//           const formattedDate = today.toLocaleDateString('en-US', options).split(', ')

//           setCurrentDate({
//               day: formattedDate[0],
//               month: formattedDate[1],
//               year: formattedDate[2],
//           });
//       };

//       // Fetch the date only on the client side
//       getDate()
//   }

//     // Load face-api models
//     Promise.all([
//       faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//       faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//       faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
//     ]).then(() => {
//       setFaceModel(true)
//       setIsLoaded(true)
//       startVideo() // Start video stream once models are loaded
//     })

//     // loadModel();

//     return () => {
//       stopVideo()
//       removeCanvas()
//     }
//   }, [])
  

//   useEffect(() => {
//     getUserSubjects()
//   }, [user])

//   return (
//     <div className="p-6 min-h-screen relative" ref={attendRef}>
//         {alert.description && <Alert description={alert.description} type={alert.type}/>}
//         <h1 className="text-3xl font-bold">Attendance</h1>
//         <h2 className="text-lg font-semibold">
//             {currentDate.day}, {currentDate.month} {currentDate.year}
//         </h2>
//         {/* <Divider /> */}
//         <p className='mt-4 text-rose-500 font-bold'>Warning:</p>
//         <p className='text-rose-500 font-semibold'>You have to attend before 15 minutes late.</p>
//         <Divider />
//         {/* {
//           (loadSubject && attendSubject != null)
//           && */}
//           <div className={`${(loadSubject && attendSubject ? "" : "hidden")}`}>
//             <video 
//                 ref={videoRef} 
//                 autoPlay 
//                 className="w-1/2 block"
//             />
//             <br />
//             <button className='btn btn-success text-white mb-4' onClick={captureImage} disabled={!isLoaded}>Capture Image</button>
//             {!isLoaded && <p>Loading models...</p>}
//           </div>
//         {/* } */}
//         {
//           loadSubject && attendSubject == null
//           &&
//           <div>
//             <h2 className='text-2xl font-semibold'>There is no subject to attend now</h2>
//             <Link href="/subjects">Go to <span className='text-blue-500'>subjects</span></Link>
//           </div>
//         }
//     </div>
//   )
// }

"use client";
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import axios from "axios"; // Import Axios
import * as faceapi from "@vladmandic/face-api"; // Import updated face-api.js

const ObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  const fetchPhoto = async (userId) => {
    try {
      const response = await axios.get(`/api/photos/${userId}`);
      setBase64Image(`data:image/png;base64,${response.data.photo}`);
    } catch (error) {
      console.error("Error fetching photo:", error);
      setError("Error fetching photo");
    }
  };

  const redirect = async (id) => {
    const res = await axios.get(`/api/users/${id}`);
    if (res.data.user.role !== "student") {
      router.push("/dashboard");
    }
  };

  const getUser = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      setError("Error fetching user data");
    }
  };

  const detectObjects = async (model) => {
    const video = videoRef.current;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            setInterval(() => {
              detectFrame(video, model);
            }, 100);
          };
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }
  };

  const detectFrame = async (video, model) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.detect(video);
    const analyzedPredictions = analyzeContext(predictions, video);

    setDetectedObjects(analyzedPredictions);

    analyzedPredictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      ctx.strokeStyle = prediction.context === "photo" ? "blue" : "green";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "green";
      ctx.font = "18px Arial";
      ctx.fillText(
        `${prediction.class} (${prediction.context})`,
        x,
        y > 10 ? y - 5 : 10
      );
    });

    // Now, perform face detection
    if (capturedImage && base64Image) {
      compareImages(capturedImage, base64Image);
    }
  };

  const analyzeContext = (predictions, video) => {
    return predictions.map((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const area = width * height;
      const videoArea = video.videoWidth * video.videoHeight;

      if (prediction.class === "person" && area / videoArea > 0.5) {
        return { ...prediction, context: "live" };
      }
      return { ...prediction, context: "photo" };
    });
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);
    compareImages(imageUrl, base64Image);
  };

  const loadImage = (base64) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });
  };

  const compareImages = async (capturedImageUrl, base64ImageUrl) => {
    try {
      // Load images
      const capturedImage = await loadImage(capturedImageUrl);
      const base64Image = await loadImage(base64ImageUrl);
      
      console.log('start');
  
      // Detect faces
      const capturedDetection = await faceapi.detectSingleFace(capturedImage).withFaceLandmarks().withFaceDescriptor();
      const base64Detection = await faceapi.detectSingleFace(base64Image).withFaceLandmarks().withFaceDescriptor();
  
      // Check if no face was detected
      if (!capturedDetection || !base64Detection) {
        console.error("No face detected in one or both images.");
        return;
      }
  
      // Get face descriptors
      const capturedDescriptor = capturedDetection.descriptor;
      const base64Descriptor = base64Detection.descriptor;
  
      // Compute Euclidean distance
      const distance = faceapi.euclideanDistance(capturedDescriptor, base64Descriptor);
      console.log("Euclidean Distance:", distance);
  
      // Threshold for similarity
      const THRESHOLD = 0.6;
      if (distance < THRESHOLD) {
        console.log("The images match!");
      } else {
        console.log("The images do not match.");
      }
    } catch (error) {
      console.error('Error during image comparison:', error);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      // Load face-api.js models
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

      setIsModelLoaded(true);

      const model = await cocoSsd.load();
      detectObjects(model);
      console.log("model loaded");

      const id = sessionStorage.getItem("userId");
      if (id) {
        redirect(id);
        fetchPhoto(id);
        getUser(id);
      }
    };

    loadModels();
  }, []);

  return (
    <div>
      <h1>Enhanced Object Detection</h1>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} />
      {!isModelLoaded && <p>Loading models...</p>}
      <div>
        <h2>Detected Objects</h2>
        <ul>
          {detectedObjects.map((obj, index) => (
            <li key={index}>
              {obj.class} ({obj.context}): {Math.round(obj.score * 100)}%
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleCapture}>Capture Image</button>
      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImage} alt="Captured Snapshot" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
