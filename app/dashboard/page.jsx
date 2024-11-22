"use client"

import { Card, MiniCard, Divider, CardRoom } from "../components"
import { useState, useEffect } from "react"
import axios from "axios";

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [id, setId] = useState("")
    const [role, setRole] = useState("")
    const [subjects, setSubjects] = useState([])
    const [rooms, setRooms] = useState([])

    const getRole = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`)
            setRole(res.data.user.role)
        } catch (error) {
            console.error(error)
        }
    }

    const getRooms = async () => {
        const res = await axios.get('/api/rooms')
        setRooms(res.data.rooms)
    }

    const getSubjects = async () => {
        const res = await axios.get('/api/subjects')
        setSubjects(res.data.subjects)
    }

    useEffect(() => {
        const id = sessionStorage.getItem("userId")
        setId(id)
        
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
    }, []);

    useEffect(() => {
        getRooms()
        getSubjects()
    }, [role])

    return (
        <div className="p-6 min-h-screen relative">
            <h1 className="text-3xl font-bold">DASHBOARD</h1>
            <h2 className="text-lg font-semibold">
                {currentDate.day}, {currentDate.month} {currentDate.year}
            </h2>
            <Divider />
            <div className="my-4 flex gap-4">
                {role === "student" && <MiniCard title={"Today"} subTitle={"Subjects"} description={2} />}
                <MiniCard title={"Total"} subTitle={"Subjects"} description={subjects?.length || 0} />
                {role === "admin" && <MiniCard title={"Total"} subTitle={"Rooms"} description={rooms?.length || 0} />}
            </div>
            <Divider/>
            <div className="mt-5 flex flex-col gap-10">
                <h2 className="text-xl font-bold">Subjects</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {
                        subjects.map((subject, index) => (
                            <Card />
                        ))
                    }
                </div>
            </div>
            <Divider />
    
        </div>
    );
}
