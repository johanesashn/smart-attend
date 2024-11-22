"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Divider, Alert } from "../components";
import { useRouter } from "next/navigation";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import Link from "next/link";

export default function page(){
    const [alert, setAlert] = useState("")
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [rooms, setRooms] = useState([])
    const [room, setRoom] = useState({
        name: "", 
        longitude: "", 
        latitude: "",
        range: "", 
        id: ""
    })

    const getRooms = async () => {
        try {
            const res = await axios.get('/api/rooms')
            setRooms(res.data.rooms)
        } catch (error) {
            console.error(error)
        }
    }

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

    const deleteRoom = async (id) => {
        try {
            await axios.delete(`/api/rooms/${id}`)
            getRooms()
            setAlert("Room has been deleted")
            setTimeout(() => {
                setAlert("")
            }, 3000);
        } catch (error) {
            console.error(error)
        }
    }

    const updateRoom = async (e) => {
        e.preventDefault()
        try {
            if (
                room.name !== "" &&
                room.longitude !== "" &&
                room.latitude !== "" &&
                room.range != 0
            ) {
                await axios.put(`/api/rooms/${room.id}`, room)
                setRoom({
                    name: "", 
                    longitude: "", 
                    latitude: "", 
                    range: 0, 
                    id: ""
                })
                getRooms()
                setAlert("Room has been updated")
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
            redirect(id)
        }

        getRooms()
    }, [])

    return (
        <div className="p-6 min-h-screen relative">
            {alert !== "" && <Alert description={alert} type={alert === "Room has been deleted" ? "danger" : "success"}/>}
            <h1 className="text-3xl font-bold">ROOMS</h1>
            <h2 className="text-lg font-semibold">
                {currentDate.day}, {currentDate.month} {currentDate.year}
            </h2>
            <Divider/>
            {
                room.id !== "" 
                &&
                <div className="mb-8">
                    <form onSubmit={updateRoom}>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Name</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={room.name}
                                onChange={(e) => setRoom(prev => ({...prev, name: e.target.value}))}
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
                                value={room.longitude}
                                onChange={(e) => setRoom(prev => ({...prev, longitude: e.target.value}))}
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
                                value={room.latitude}
                                onChange={(e) => setRoom(prev => ({...prev, latitude: e.target.value}))}
                            />
                        </label>
                        <label className="form-control w-full mb-3">
                            <div className="label">
                                <span className="label-text">Range</span>
                            </div>
                            <input 
                                type="number" 
                                placeholder="Type here" 
                                className="input input-bordered w-full" 
                                value={room.range}
                                onChange={(e) => setRoom(prev => ({...prev, range: e.target.value}))}
                            />
                        </label>
                        <button type="submit" className="text-white mt-4 btn bg-success">Update Room</button>
                    </form>
                </div>
            }
            <Link href="/setting">Go to <span className="text-success font-semibold underline">setting</span> to add room</Link>
            <div className="w-full overflow-x-scroll border mt-4">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                        <th>Range</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        rooms.map((room, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{room.name}</td>
                                <td>{room.longitude}</td>
                                <td>{room.latitude}</td>
                                <td>{room.range}</td>
                                <td className="flex gap-2">
                                    <button 
                                        className="btn bg-rose-500 text-white"
                                        onClick={() => deleteRoom(room._id)}
                                    >
                                        <MdDeleteOutline />
                                    </button>
                                    <button 
                                        className="btn bg-blue-500 text-white"
                                        onClick={() => setRoom({
                                            name: room.name, 
                                            longitude: room.longitude, 
                                            latitude: room.latitude, 
                                            range: room.range, 
                                            id: room._id
                                        })}
                                    >
                                        <MdOutlineEdit />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}