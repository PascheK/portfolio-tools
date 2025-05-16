'use client'

import React from 'react'

interface AuthButtonProps {
  user: boolean
  login: () => void
  logout: () => void
  closeSidebar: () => void
}

export const AuthButton: React.FC<AuthButtonProps> = ({ user, login, logout, closeSidebar }) => {
  const handleClick = () => {
    if (user) {
      logout()
    } else {
      login()
    }
    closeSidebar()
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded w-full font-bold text-dark-text transition-colors duration-200 ${
        user ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {user ? 'Logout' : 'Login'}
    </button>
  )
}
