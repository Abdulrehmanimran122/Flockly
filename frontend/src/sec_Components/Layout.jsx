import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, showSidebar }) => {
    return <div className='h-full'>
        <div className='flex'>
            {showSidebar && <Sidebar />}
            <div className='flex-1 flex flex-col'>
                <Navbar />
                <main className='flex-1'>
                    {children}
                </main>
            </div>
        </div>
    </div>
}

export default Layout