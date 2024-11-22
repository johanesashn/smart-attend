import React from 'react'

const loading = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-4'>
      <span className="loading loading-bars loading-lg"></span>
      <p className='font-semibold '>Fetching Content</p>
    </div>
  )
}

export default loading
