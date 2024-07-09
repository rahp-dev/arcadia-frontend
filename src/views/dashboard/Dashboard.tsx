import React from 'react'
import { HiOutlineEmojiHappy } from 'react-icons/hi'

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <HiOutlineEmojiHappy size={200} />
        </div>
        <h2>Página en desarrollo</h2>
        <p className="text-base my-2">
          Nos estamos centrando en el desarrollo de esta vista, ¡llegará
          proximamente!
        </p>
      </div>
    </div>
  )
}

export default Dashboard
