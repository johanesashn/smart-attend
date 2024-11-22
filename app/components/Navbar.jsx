// import modules
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CiLogout } from "react-icons/ci"
import { RxDashboard } from "react-icons/rx"
import { LuClipboardCheck, LuUsers } from "react-icons/lu"
import { SiGoogleclassroom } from "react-icons/si";
import { FiBook } from "react-icons/fi";
import { CiSettings } from "react-icons/ci"
import axios from 'axios'

// navbar component
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true) // State to manage dropdown visibility
    const [isClient, setIsClient] = useState(false) // State to check if window is available (client-side)
    const pathname = usePathname()
    const [role, setRole] = useState("")

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    // Check if running on client
    useEffect(() => {
        setIsClient(true)
    }, [])

    const getRole = async (id) => {
        const res = await axios.get(`/api/users/${id}`)
        setRole(res.data.user.role)
    }

    useEffect(() => {
        const id = sessionStorage.getItem("userId")
        if (id) {
            getRole(id)
        }
    }, [pathname])

    return (
        pathname !== "/" && (
            <>
                <div className="px-6 navbar lg:hidden bg-slate-100 md:px-10 fixed top-0 left-0">
                    <div className="navbar-start">
                        <Link href="/dashboard" className="font-semibold text-xl">Iamhere</Link>
                    </div>
                    <div className="navbar-end">
                        <div 
                            className="dropdown" 
                            onClick={handleToggle}
                        >
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            {isOpen && (
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-slate-100 rounded-box z-[1] mt-4 w-52 p-2 shadow right-0"
                                >
                                    <li className="mb-2">
                                        <Link href="/dashboard">
                                            <RxDashboard size={20}/>Dashboard
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link href="/dashboard">
                                            <FiBook size={20}/>Subjects
                                        </Link>
                                    </li>
                                    {
                                        role === "student"
                                        &&
                                        <li className="mb-2">
                                            <Link href="/attend">
                                                <LuClipboardCheck  size={20}/>Attend
                                            </Link>
                                        </li>
                                    }
                                    {
                                        role === "admin"
                                        &&
                                        <li className="mb-2">
                                            <Link href="/rooms">
                                                <SiGoogleclassroom  size={20}/>Rooms
                                            </Link>
                                        </li>
                                    }
                                    <li className="mb-2">
                                        <Link href="/setting">
                                            <CiSettings size={20}/>Setting
                                        </Link>
                                    </li>
                                    <li className="my-1 text-white bg-slate-500 rounded-lg">
                                        <Link href="/">
                                            <CiLogout color='white' size={20}/>  
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                {isClient && window.innerWidth >= 1024 && (
                    <div className='border bg-slate-100 h-screen p-8 relative'>
                        <h2 className='text-xl font-bold'>Iamhere</h2>
                        <div className='flex flex-col mt-12 gap-6'>
                            <Link className='flex items-center gap-2' href="/dashboard">
                                <RxDashboard size={20}/>Dashboard
                            </Link>
                            {
                                role === "student"
                                &&
                                <Link className='flex items-center gap-2' href="/attend">
                                    <LuClipboardCheck size={20}/>Attend
                                </Link>
                            }
                            <Link className='flex items-center gap-2' href="/subjects">
                                <FiBook size={20}/>Subjects
                            </Link>
                            {
                                role === "admin"
                                &&
                                <>
                                    <Link className='flex items-center gap-2' href="/rooms">
                                        <SiGoogleclassroom size={20}/>Rooms
                                    </Link>
                                    <Link className='flex items-center gap-2' href="/users">
                                        <LuUsers size={20}/>Users
                                    </Link>
                                </>
                            }
                            <Link className='flex items-center gap-2' href="/setting">
                                <CiSettings size={20}/>Setting
                            </Link>
                        </div>
                        <Link href="/" className='bottom-0 absolute left-0 right-0 p-8 py-4 text-white flex items-center font-semibold gap-2 bg-slate-500'>
                            <CiLogout color='white' size={20}/>Logout
                        </Link>
                    </div>
                )}
            </>
        )
    )
}

export default Navbar
