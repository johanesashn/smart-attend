import React from 'react'

const Alert = ({description, type}) => {
  return (
    <div role="alert" className={`z-20 fixed flex gap-6 px-6 py-4 rounded-xl right-4 left-4 text-white ${type === "success" ? "bg-success" : "bg-rose-500"}`}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{description}</span>
    </div>
  )
}

export default Alert
