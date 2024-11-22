"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Divider, Alert } from "../components";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { RiAddLargeFill } from "react-icons/ri";
import Link from "next/link";

export default function page(){
    const [alert, setAlert] = useState("")
    // const router = useRouter()
    const [currentDate, setCurrentDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState({
        name: "", 
        room: "", 
        day: "", 
        time_start: "",
        time_end: "",
        duration: 0, 
        lecturer: "", 
        id: "",
        type: "edit"
    })
    const [lecturers, setLecturers] = useState([])
    const [rooms, setRooms] = useState([])
    const [loggedUser, setLoggedUser] = useState({})
    const [userSubjects, setUserSubjects] = useState([])
    const [addSubject, setAddSubject] = useState(false)

    const getSubjects = async () => {
        try {
            const res = await axios.get('/api/subjects')
            setSubjects(res.data.subjects)
        } catch (error) {
            console.error(error)
        }
    }

    const getUserSubjects = async () => {
        try {
            const subjectsData = await Promise.all(
                loggedUser?.subjects.map(async subject => {
                    const res = await axios.get(`/api/subjects/${subject}`);
                    return res.data.subject;
                })
            );
            setUserSubjects(subjectsData);
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

    const getRooms = async () => {
        try {
            const res = await axios.get('/api/rooms')
            setRooms(res.data.rooms)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubject = async (userId, subject) => {
        try {
            await axios.post(`/api/users/${userId}/${subject}`)
            getLoggedUser(loggedUser.id)
            setAlert("Subject has been added")
            setTimeout(() => {
                setAlert("")
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    // const redirect = async (id) => {
    //     try {
    //         const res = await axios.get(`/api/users/${id}`)
    //         if (res.data.user.role !== "admin"){
    //             router.push('/dashboard')
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    const getLoggedUser = async (id) => {
        if (id){
            try {
                const res = await axios.get(`/api/users/${id}`)
                setLoggedUser(res.data.user)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const deleteSubject = async (name) => {
        try {
            await axios.delete(`/api/subjects/${name}`)
            getSubjects()
            setAlert("Subject has been deleted")
            setTimeout(() => {
                setAlert("")
            }, 3000);
        } catch (error) {
            console.error(error)
        }
    }

    const removeSubjectFromStudent = async (subject) => {
        try {
            await axios.delete(`/api/users/${loggedUser.id}/${subject}`)
            getLoggedUser(loggedUser.id)
            setAlert("Subject has been deleted")
            setTimeout(() => {
                setAlert("")
            }, 3000);
        } catch (error) {
            console.error(error)
        }
    }

    const updateSubject = async (e) => {
        e.preventDefault()
        console.log(subject.type)
        try {
            if (
                subject.room !== "" &&
                subject.day !== "" &&
                subject.time_start !== "" &&
                subject.lecturer !== "" &&
                subject.duration != 0, 
                subject.id !== ""
            ) {
                await axios.put(`/api/subjects/${subject.name}`, subject)
                setSubject({
                    name: "", 
                    room: "", 
                    day: "", 
                    time_start: "",
                    time_end: "",
                    duration: 0, 
                    lecturer: "", 
                    id: "",
                    type: "edit"
                })
                getSubjects()
                setAlert("Subject has been updated")
                setTimeout(() => {
                    setAlert("")
                }, 3000);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
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

        const id = sessionStorage.getItem("userId")
        if (id) {
            getLoggedUser(id)
        }

        getLecturers()
        getRooms()
        getSubjects()
    }, [])

    useEffect(() => {
        getUserSubjects()
    }, [loggedUser])

    return (
        <div className="p-6 min-h-screen relative">
            {alert !== "" && <Alert description={alert} type={alert === "Subject has been deleted"? "danger" : "success"}/>}
            <h1 className="text-3xl font-bold">SUBJECTS</h1>
            <h2 className="text-lg font-semibold">
                {currentDate.day}, {currentDate.month} {currentDate.year}
            </h2>
            <Divider/>
            {
                subject.id !== ""
                &&
                <div className="mb-8">
                    <form onSubmit={updateSubject}>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Room</span>
                            </div>
                            <select 
                                className="select select-bordered w-full"
                                value={subject.room || ""}
                                onChange={(e) => setSubject(prev => ({...prev, room: e.target.value}))}
                            >
                                {
                                    rooms?.map((room, index) => (
                                        <option key={index} value={room.name}>{room.name}</option>
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
                                value={subject.day || ""}
                                onChange={(e) => setSubject(prev => ({...prev, day: e.target.value}))}
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
                                <span className="label-text">Time Start</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={subject.time_start}
                                onChange={(e) => setSubject(prev => ({...prev, time_start: e.target.value}))}
                            />
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Time End</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={subject.time_end}
                                onChange={(e) => setSubject(prev => ({...prev, time_end: e.target.value}))}
                            />
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Duration</span>
                            </div>
                            <input 
                                type="number" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={subject.duration}
                                onChange={(e) => setSubject(prev => ({...prev, duration: e.target.value}))}
                            />
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Lecturer</span>
                            </div>
                            <select 
                                className="select select-bordered w-full"
                                value={subject.lecturer || ""}
                                onChange={(e) => setSubject(prev => ({...prev, lecturer: e.target.value}))}
                            >
                                {
                                    lecturers?.map((lecturer, index) => (
                                        <option key={index} value={lecturer.name}>{lecturer.name}</option>
                                    ))
                                }
                            </select>
                        </label>
                        <button type="submit" className="text-white mt-4 btn bg-success">Update Subject</button>
                    </form>
                </div>
            }
            <>
                {loggedUser.role === "admin" && <Link href="/setting">Go to <span className="text-success font-semibold underline">setting</span> to add subject</Link>} 
                {
                    loggedUser.role === "student" 
                    && 
                    <button 
                        className={`btn ${addSubject ? "bg-rose-500" : "bg-blue-500"} text-white`}
                        onClick={() => setAddSubject(prev => !prev)}
                    >
                        {addSubject ? "Close" : "Add Subjects"}
                    </button>
                }
                {
                    (
                        (loggedUser.role === "admin")
                        ||
                        (loggedUser.role === "student" && addSubject)
                    )
                    &&
                    <div className="w-full overflow-x-scroll border mt-4">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Room</th>
                                <th>Day</th>
                                <th>Time Start</th>
                                <th>Time End</th>
                                <th>Duration</th>
                                <th>Lecturer</th>
                                {loggedUser.role === "admin" && <th>Action</th>}
                                {loggedUser.role !== "admin" && <th>Add</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                subjects?.map((subject, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{subject.name}</td>
                                        <td>{subject.room}</td>
                                        <td>{subject.day}</td>
                                        <td>{subject.time_start}</td>
                                        <td>{subject.time_end}</td>
                                        <td>{subject.duration}</td>
                                        <td>{subject.lecturer}</td>
                                        <td className="flex gap-2">
                                            {
                                                loggedUser.role === "admin"
                                                &&
                                                <>
                                                    <button 
                                                        className="btn bg-rose-500 text-white"
                                                        onClick={() => deleteSubject(subject.name)}
                                                    >
                                                        <MdDeleteOutline />
                                                    </button>
                                                    <button 
                                                        className="btn bg-blue-500 text-white"
                                                        onClick={() => setSubject({
                                                            name: subject.name, 
                                                            room: subject.room, 
                                                            day: subject.day, 
                                                            time_start: subject.time_start, 
                                                            time_end: subject.time_end,
                                                            duration: subject.duration, 
                                                            lecturer: subject.lecturer, 
                                                            id: subject._id, 
                                                            type: "edit"
                                                        })}     
                                                    >
                                                            <MdOutlineEdit />
                                                    </button>
                                                </>
                                            }
                                            {
                                                loggedUser.role === "student"
                                                &&
                                                <button 
                                                    disabled={loggedUser.subjects.includes(subject.name)}
                                                    className="btn btn-success text-white"   
                                                    onClick={() => handleSubject(loggedUser.id, subject.name)}
                                                >
                                                    <RiAddLargeFill />
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                }
            </>
            {
                loggedUser?.role === "student"
                &&
                <h2 className="text-xl font-bold my-4">Your Subject</h2>
            }
            {
                (loggedUser?.role === "student" || loggedUser?.role === "lecturer")
                &&
                <div className="w-full overflow-x-scroll border mt-8">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Room</th>
                            <th>Day</th>
                            <th>Time Start</th>
                            <th>Time End</th>
                            <th>Duration</th>
                            <th>Lecturer</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            userSubjects.map((subject, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{subject.name}</td>
                                    <td>{subject.room}</td>
                                    <td>{subject.day}</td>
                                    <td>{subject.time_start}</td>
                                    <td>{subject.time_end}</td>
                                    <td>{subject.duration}</td>
                                    <td>{subject.lecturer}</td>
                                    <td className="flex gap-2">
                                        <button 
                                            className="btn bg-rose-500 text-white"
                                            onClick={() => removeSubjectFromStudent(subject.name)}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}