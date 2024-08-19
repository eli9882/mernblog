import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPostPage = location.pathname.startsWith('/posts/');

  return (
    <>
      <Header showMenu={!isLoginPage && !isPostPage} />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
