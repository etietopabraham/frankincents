import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { logo, logo_2 } from './assets';
import { Home, CreatePost } from './pages';

const App = () => {
  return (
      <BrowserRouter>

      {/* This is the header section */}
        <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
          <Link to="/">
            <img src={logo} alt='logo' className='w-28 object-contain'/>
          </Link>

          <Link to="/">
            <img src={logo_2} alt='logo' className='w-28 object-contain'/>
          </Link>

          <Link to="/create-post" className='font-inter font-medium bg-[#000000] text-white px-4 py-2 rounded-md'>
            Create
          </Link>
        </header>

      {/* This is the main section */}
        <main className='sm:p-8 px-4 py-8 w-full bg-[#000000] min-h-[calc(100vh-73px)] text-white'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/create-post' element={<CreatePost />} />
          </Routes>
        </main>

      </BrowserRouter>
  )
}

export default App