"use client"

import React from 'react'
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  return (
    pathname !== "/" && 
    <div className='bg-slate-500 text-white p-8 py-4 text-center mt-4'>
        Iamhere &copy; 2024
    </div>
  )
}

export default Footer
