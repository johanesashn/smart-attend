"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Alert } from "../components";

export default function LoginCard() {
    const router = useRouter();
    const [haveAccount, setHaveAccount] = useState(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(false);
    const [user, setUser] = useState({
        name: "", 
        id: "", 
        password: "", 
        confirmPassword: "", 
        role: "", 
        photo: "", 
        gender: "", 
        year: "",
        major: "", 
        subjects: []
    });

    useEffect(() => {
        let stream;
        if (!haveAccount && user.role === "student") {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((mediaStream) => {
                    stream = mediaStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.error("Error accessing camera: ", err);
                });
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [haveAccount, user]);

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/png');
            setCapturedImage(imageDataUrl);
        }
    };

    const login = async (e) => {
        e.preventDefault();
        if (haveAccount) {
            const { id, password } = user;
            try {
                const res = await axios.post('/api/auth', { id, password });
                const data = res.data;

                if (data.message === "Login successful") {
                    sessionStorage.setItem('userId', id);
                    router.push("/dashboard");
                } else {
                    setError("Wrong username or password")
                    setTimeout(() => {
                        setError("")
                    }, 3000);
                }
            } catch (error) {
                setError("Wrong username or password")
                setTimeout(() => {
                    setError("")
                }, 3000);
            }
        } else {
            const { name, id, password, year, major, role, gender, confirmPassword } = user;

            if (password === confirmPassword) {
                try {
                    const res = await axios.post('/api/users', { name, id, password, year, major, role, gender });

                    if (res.status === 201) {
                        if (capturedImage) {
                            const base64Image = capturedImage.split(',')[1];
                            console.log(base64Image)
                            const photoRes = await axios.post('/api/photos', { id, photo: base64Image });

                            if (photoRes.status === 200) {
                                console.log("Photo uploaded successfully.");
                            } else {
                                console.error("Error uploading photo:", photoRes.data);
                            }
                        }
                        sessionStorage.setItem('userId', id);
                        router.push("/dashboard");
                    } 
                } catch (error) {
                    if (error.status) {
                        setError("Id already exist")
                        setTimeout(() => {
                            setError("")
                        }, 3000);
                    }
                }
            } else {
                setError("Password doesn't match")
                setTimeout(() => {
                    setError("")
                }, 3000);
            }
        }
    };

    return (
        <div className="p-10 bg-white rounded-xl w-10/12 md:w-3/4 lg:w-1/3 shadow">
            <h1 className="text-4xl font-bold mb-4 text-center">Iamhere</h1>
            <form onSubmit={login}>
                {
                    !haveAccount
                    &&
                    <label className="form-control w-full mb-3">
                        <div className="label">
                            <span className="label-text">Name</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Type here" 
                            className="input input-bordered w-full" 
                            value={user.name}
                            onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                        />
                    </label>
                }
                <label className="form-control w-full mb-3">
                    <div className="label">
                        <span className="label-text">Id</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Type here" 
                        className="input input-bordered w-full" 
                        value={user.id}
                        onChange={(e) => setUser(prev => ({...prev, id: e.target.value}))}
                    />
                </label>
                <label className="form-control w-full mb-3">
                    <div className="label">
                        <span className="label-text">Password</span>
                    </div>
                    <input 
                        type="password" 
                        placeholder="Type here" 
                        className="input input-bordered w-full" 
                        value={user.password}
                        onChange={(e) => setUser(prev => ({...prev, password: e.target.value}))}
                    />
                </label>
                {
                    !haveAccount &&
                    <>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Confirm password</span>
                            </div>
                            <input 
                                type="password" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={user.confirmPassword}
                                onChange={(e) => setUser(prev => ({...prev, confirmPassword: e.target.value}))}
                            />
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Gender</span>
                            </div>
                            <select 
                                className="select select-bordered w-full"
                                value={user.gender || ""}
                                onChange={(e) => setUser(prev => ({...prev, gender: e.target.value}))}
                            >
                                <option disabled value="">What is your gender?</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Role</span>
                            </div>
                            <select 
                                className="select select-bordered w-full"
                                value={user.role || ""}
                                onChange={(e) => setUser(prev => ({...prev, role: e.target.value}))}
                            >
                                <option disabled value="">Who are you?</option>
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>
                        </label>
                        {
                            user.role === "student"
                            &&
                            <>
                                <label className="form-control w-full mb-3">
                                    <div className="label">
                                        <span className="label-text">Year</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Type here" 
                                        className="input input-bordered w-full" 
                                        value={user.year}
                                        onChange={(e) => setUser(prev => ({...prev, year: e.target.value}))}
                                    />
                                </label>
                                <label className="form-control w-full mb-3">
                                    <div className="label">
                                        <span className="label-text">Major</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Type here" 
                                        className="input input-bordered w-full" 
                                        value={user.major}
                                        onChange={(e) => setUser(prev => ({...prev, major: e.target.value}))}
                                    />
                                </label>
                                <label className={`form-control w-full mb-3`}>
                                    <div className="label">
                                        <span className="label-text">Take photo</span>
                                    </div>
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        className="w-1/2 block"
                                    />
                                    <button 
                                        type="button" 
                                        className="btn mt-2 w-1/2 text-white bg-blue-500" 
                                        onClick={captureImage}
                                    >
                                        Capture Photo
                                    </button>
                                </label>
                                {/* Display the captured image */}
                                {capturedImage && (
                                    <div className="mt-3">
                                        <p className='mb-2 text-sm'>Captured Image</p>
                                        <img src={capturedImage} alt="Captured" className="w-1/2" />
                                    </div>
                                )}
        
                                {/* Canvas element for capturing video frame */}
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </>
                        }

                    </>
                }
                <div className='flex flex-col items-center'>
                    <button type="submit" className="btn mt-5 text-white bg-success w-32">{haveAccount ? "Login" : "Register"}</button>
                    <p className="mt-4">
                        {haveAccount ? "Don't have an account? " : "Already have an account? "}
                        <span className="link text-blue-500 font-semibold" onClick={() => setHaveAccount(!haveAccount)}>
                            {haveAccount ? "Register" : "Login"}
                        </span>
                    </p>
                </div>
                <div className='fixed top-0 left-0 right-0'>
                    <span className='my-4 block'></span>
                    {error && <Alert description={error} type={"danger"}/>}
                </div>
            </form>
        </div>
    );
}
