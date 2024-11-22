"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Divider, Alert } from "../components";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";

export default function page(){
    const [alert, setAlert] = useState("")
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [students, setStudents] = useState([])
    const [lecturers, setLecturers] = useState([])
    const [active, setActive] = useState("lecturers")

    const redirect = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`)
            if (res.data.user.role !== "admin"){
              router.push('/dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getStudents = async () => {
        try {
            const res = await axios.get('/api/users/student')
            setStudents(res.data.students)   
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

    const deleteUser = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`)
            getStudents()
            getLecturers()
            setAlert("User has been deleted")
            setTimeout(() => {
                setAlert("")
            }, 3000);
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

        getStudents()
        getLecturers()
        
        const id = sessionStorage.getItem("userId")
        if (id) {
            redirect(id)
        }
    }, [])

    return (
        <div className="p-6 min-h-screen relative">
            {alert !== "" && <Alert description={alert} type={"danger"}/>}
            <h1 className="text-3xl font-bold">USERS</h1>
            <h2 className="text-lg font-semibold">
                {currentDate.day}, {currentDate.month} {currentDate.year}
            </h2>
            <Divider/>
            <div className="flex gap-4">
                <button  
                    className={`btn ${active === "lecturers" && "bg-blue-500 text-white"}`}
                    onClick={() => setActive("lecturers")}
                >
                    Lecturers
                </button>
                <button  
                    className={`btn ${active === "students" && "bg-blue-500 text-white"}`}
                    onClick={() => setActive("students")}
                >
                    Students
                </button>
            </div>
            <h1 className="text-2xl my-4 font-bold">
                {active.charAt(0).toUpperCase() + active.slice(1)}
            </h1>
            <div className="w-full overflow-x-scroll border">
                {
                    active === "students"
                    &&
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Year</th>
                            <th>Major</th>
                            <th>Subjects</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            students.map((student, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.year}</td>
                                    <td>{student.major}</td>
                                    <td>
                                        <ul>
                                            {student.subjects.map((subject, index) => (
                                                <li key={index}>- {subject}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn bg-rose-500 text-white"
                                            onClick={() => deleteUser(student.id)}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                }
                {
                    active === "lecturers"
                    &&
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Subjects</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            lecturers.map((lecturer, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{lecturer.id}</td>
                                    <td>{lecturer.name}</td>
                                    <td>{lecturer.gender}</td>
                                    <td>
                                        <ul>
                                            {lecturer.subjects.map((subject, index) => (
                                                <li key={index}>- {subject}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn bg-rose-500 text-white"
                                            onClick={() => deleteUser(lecturer._id)}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}