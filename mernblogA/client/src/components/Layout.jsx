import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Loader from './Loader'; // Asegúrate de tener un componente Loader

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPostPage = location.pathname.startsWith('/posts/');

  useEffect(() => {
    // Simulando una carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header showMenu={!isLoginPage && !isPostPage} />
      {isLoading ? <Loader /> : <Outlet />}
      <Footer />
    </>
  );
}

export default Layout;
