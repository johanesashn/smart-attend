"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Divider, Alert } from "../components";

export default function Setting(){
    const [role, setRole] = useState("")
    const [alert, setAlert] = useState({
        description: "", 
        type: ""
    })
    const [currentDate, setCurrentDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [add, setAdd] = useState("room")
    const [newSubject, setNewSubject] = useState({
        name: "", 
        room: "", 
        lecturer: "", 
        day: "", 
        time_start: "", 
        time_end: "",
        duration: 0
    })
    const [newRoom, setNewRoom] = useState({
        name: "",
        longitude: "", 
        latitude: "", 
        range: 0
    })
    const [rooms, setRooms] = useState([])
    const [lecturers, setLecturers] = useState([])
    const [id, setId] = useState("")
    const [loggedUser, setLoggedUser] = useState({})
    const [updatePass, setUpdatePass] = useState({
        change: false,
        oldPass: "", 
        newPass: "", 
    })

    const getLoggedUser = async () => {
        if (id){
            try {
                const res = await axios.get(`/api/users/${id}`)
                setLoggedUser(res.data.user)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const getRole = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`)
            setRole(res.data.user.role)
        } catch (error) {
            console.error(error)
        }
    }

    const getRooms = async () => {
        try {
            const res = await axios.get('/api/rooms')
            setRooms(res.data.rooms)
        } catch (error) {
            console.error(error)
        }
    }

    const getLecturers = async () => {
        try {
            const res = await axios.get('/api/users/lecturer')
            setLecturers(res.data.lecturers)
        } catch (error) {
            console.error(error)
        }
    }

    const handlePass = async (e) => {
        e.preventDefault()
        if (updatePass.oldPass !== "" && updatePass.newPass !== ""){
            try {
                await axios.put("/api/users/password", {
                    id: id, 
                    oldPassword: updatePass.oldPass, 
                    newPassword: updatePass.newPass
                })
                setAlert({
                    description: "Password has been changed", 
                    type: "success"
                })
                setTimeout(() => {
                    setAlert({description: "", type: ""})
                }, 3000);
                setUpdatePass({
                    change: false,
                    oldPass: "", 
                    newPass: ""
                })
            } catch (error) {
                setAlert({
                    description: "Password doesn't match", 
                    type: "danger"
                })
                setTimeout(() => {
                    setAlert({description: "", type: ""})
                }, 3000);
            }
        }
    }

    const addSubject = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/subjects', newSubject);
            setNewSubject({
                name: "", 
                room: "", 
                lecturer: "", 
                day: "", 
                time_start: "", 
                time_end: "",
                duration: 0
            })
            setAlert({
                description: "New subject has been made", 
                type: "success"
            })
            setTimeout(() => {
                setAlert({description: "", type: ""})
            }, 3000);
        } catch (error) {
            if (error.status === 400){
                setAlert({
                    description: "Subject already exists", 
                    type: "danger"
                })
                setTimeout(() => {
                    setAlert({description: "", type: ""})
                }, 3000);
            }
        }
    }

    const addRoom = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/rooms', newRoom);
            setNewRoom({
                name: "", 
                longitude: "", 
                latitude: "", 
                range: 0, 
            })
            setAlert({description: "New room has been made", type: "success"})
            setTimeout(() => {
                setAlert({description: "", type: ""})
            }, 3000);
            getRooms()
        } catch (error) {
            if (error.status == 400){
                setAlert({description: "Room already exists", type: "danger"})
                setTimeout(() => {
                    setAlert({description: "", type: ""})
                }, 3000);
            }
        }
    }

    useEffect(() => {
        const id = sessionStorage.getItem("userId")
        setId(id)
        if (id) {
            getRole(id)
        }

        if (typeof window !== 'undefined') {
            const getDate = () => {
                const today = new Date()
                const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
                const formattedDate = today.toLocaleDateString('en-US', options).split(', ')

                setCurrentDate({
                    day: formattedDate[0],
                    month: formattedDate[1],
                    year: formattedDate[2],
                });
            };

            // Fetch the date only on the client side
            getDate()
        }
    }, [])

    useEffect(() => {
        if (id !== "" && role === "admin"){
            getRooms()
            getLecturers()
        } else {
            getLoggedUser()
        }
    }, [role])

    return (
        <div className="p-6 min-h-screen relative">
            {alert.description !== "" && <Alert description={alert.description} type={alert.type}/>}
            <h1 className="text-3xl font-bold">SETTING</h1>
            <h2 className="text-lg font-semibold">
                {currentDate.day}, {currentDate.month} {currentDate.year}
            </h2>
            <Divider/>
            {
                role === "admin"
                &&
                <div>
                    <div className="flex gap-4">
                        <button  
                            className={`btn ${add === "room" && "bg-blue-500 text-white"}`}
                            onClick={() => setAdd("room")}
                        >
                            Add Room
                        </button>
                        <button  
                            className={`btn ${add === "subject" && "bg-blue-500 text-white"}`}
                            onClick={() => setAdd("subject")}
                        >
                            Add Subject
                        </button>
                    </div>
                    {
                        add === "subject"
                        &&
                        <form className="mt-4" onSubmit={addSubject}>
                            <h1 className="text-2xl mb-4 font-bold">New Subject</h1>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Name</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject(prev => ({...prev, name: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Room</span>
                                </div>
                                <select 
                                    className="select select-bordered w-full"
                                    value={newSubject.room || ""}
                                    onChange={(e) => setNewSubject(prev => ({...prev, room: e.target.value}))}
                                >
                                    <option disabled value="">Select room</option>
                                    {
                                        rooms?.map((room, index) => (
                                            <option key={index} value={room.name}>{room.name}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Lecturer</span>
                                </div>
                                <select 
                                    className="select select-bordered w-full"
                                    value={newSubject.lecturer || ""}
                                    onChange={(e) => setNewSubject(prev => ({...prev, lecturer: e.target.value}))}
                                >
                                    <option disabled value="">Select Lecturer</option>
                                    {
                                        lecturers?.map((lecturer, index) => (
                                            <option key={index} value={lecturer.name}>{lecturer.name}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Day</span>
                                </div>
                                <select 
                                    className="select select-bordered w-full"
                                    value={newSubject.day || ""}
                                    onChange={(e) => setNewSubject(prev => ({...prev, day: e.target.value}))}
                                >
                                    <option disabled value="">Select day</option>
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                </select>
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Time start</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="hh:mm" 
                                    className="input input-bordered w-full" 
                                    value={newSubject.time_start}
                                    onChange={(e) => setNewSubject(prev => ({...prev, time_start: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Time end</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="hh:mm" 
                                    className="input input-bordered w-full" 
                                    value={newSubject.time_end}
                                    onChange={(e) => setNewSubject(prev => ({...prev, time_end: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Duration</span>
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="in minute" 
                                    className="input input-bordered w-full" 
                                    value={newSubject.duration}
                                    onChange={(e) => setNewSubject(prev => ({...prev, duration: e.target.value}))}
                                />
                            </label>
                            <button type="submit" className="text-white mt-4 btn bg-success">Add Subject</button>
                        </form>
                    }
                    {
                        add === "room"
                        &&
                        <form className="mt-4" onSubmit={addRoom}>
                            <h1 className="text-2xl mb-4 font-bold">New Room</h1>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Name</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom(prev => ({...prev, name: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Longitude</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={newRoom.longitude}
                                    onChange={(e) => setNewRoom(prev => ({...prev, longitude: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Latitude</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={newRoom.latitude}
                                    onChange={(e) => setNewRoom(prev => ({...prev, latitude: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Range</span>
                                </div>
                                <input 
                                    type="Number" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={newRoom.range}
                                    onChange={(e) => setNewRoom(prev => ({...prev, range: e.target.value}))}
                                />
                            </label>
                            <button type="submit" className="text-white mt-4 btn bg-success">Add Room</button>
                        </form>
                    }
                </div>
            }
            {
                role === "student"
                &&
                <>
                    <h2 className="text-xl font-bold">Profile</h2>
                    <div className="w-full overflow-x-scroll border mt-4">
                        <table className="table table-zebra">
                        <thead className="bg-slate-400 text-white">
                            <tr>
                                <th>Attribute</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Id</td>
                                <td>{loggedUser?.id}</td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>{loggedUser?.name}</td>
                            </tr>
                            <tr>
                                <td>Year</td>
                                <td>{loggedUser?.year}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>{loggedUser?.gender}</td>
                            </tr>
                            <tr>
                                <td>Major</td>
                                <td>{loggedUser?.major}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </>
            }
            {
                role === "lecturer"
                &&
                <>
                    <h2 className="text-xl font-bold">Profile</h2>
                    <div className="w-full overflow-x-scroll border mt-4">
                        <table className="table table-zebra">
                        <thead className="bg-slate-400 text-white">
                            <tr>
                                <th>Attribute</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Id</td>
                                <td>{loggedUser?.id}</td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>{loggedUser?.name}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>{loggedUser?.gender}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </>
            }
            {
                (role === "student" || role === "lecturer")
                &&
                <div className="mt-8">
                    <button 
                        className="btn bg-blue-500 text-white"
                        onClick={() => setUpdatePass(prev => ({...prev, change: true}))}
                    >
                        Change password
                    </button>
                    {
                        updatePass.change
                        &&
                        <form className="mt-8" onSubmit={handlePass}>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">Old Password</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={updatePass.oldPass}
                                    onChange={(e) => setUpdatePass(prev => ({...prev, oldPass: e.target.value}))}
                                />
                            </label>
                            <label className="form-control w-full mb-3">
                                <div className="label">
                                    <span className="label-text">New Password</span>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type here" 
                                    className="input input-bordered w-full" 
                                    value={updatePass.newPass}
                                    onChange={(e) => setUpdatePass(prev => ({...prev, newPass: e.target.value}))}
                                />
                            </label>
                            <button type="submit" className="text-white mt-4 btn bg-success">Update</button>
                        </form>
                    }
                </div>
            }
        </div>
    )
}