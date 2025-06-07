import React from 'react'
import HeaderLayout from './Header.layout'
import FooterLayout from './Footer.layout'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <FooterLayout />
    </div>
  )
}

export default MainLayout