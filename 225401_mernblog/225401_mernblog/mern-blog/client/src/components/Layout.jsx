import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'


const Layout = () => {
  return (
    <>
        <Header/>
       <Main/>
          <Outlet/>
        <Footer/>
    </>
  )
}

export default Layout