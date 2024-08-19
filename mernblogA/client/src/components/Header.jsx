import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Logo from '../Recursos/Logos/Logo.png';
import { UserContext } from '../context/userContext';

const Header = ({ showMenu }) => {
  const { currentUser } = useContext(UserContext);
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 900);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPostPage = location.pathname.startsWith('/posts/');

  useEffect(() => {
    // Update the nav visibility based on window width
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsNavShowing(true);
      } else {
        setIsNavShowing(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close nav when navigating to a new page on small screens
    if (window.innerWidth < 900) {
      setIsNavShowing(false);
    }
  }, [location]); // Dependency on location to ensure it updates on route change

  const closeNavHandler = () => {
    if (window.innerWidth < 900) {
      setIsNavShowing(false);
    }
  };

  return (
    <header className="header" id="header">
      <Link to="/" className="scroll-link" onClick={closeNavHandler}>
        <img className='logo' src={Logo} alt="Logo" />
      </Link>
      {showMenu && !isLoginPage && !isPostPage && (
        <nav className={`main-nav ${isNavShowing ? 'nav-open' : ''}`}>
          {!currentUser?.id && (
            <ul className='main-nav-list'>
              <li><a className="main-nav-link scroll-link" href="#commitment" onClick={closeNavHandler}>Nuestro Compromiso</a></li>
              <li><a className="main-nav-link scroll-link" href="#blogs" onClick={closeNavHandler}>Blog</a></li>
              <li><a className="main-nav-link scroll-link" href="#TCU" onClick={closeNavHandler}>Trabajo Comunal</a></li>
              <li><a className="main-nav-link scroll-link" href="#collaborators" onClick={closeNavHandler}>Colaboradores</a></li>
              <li><a className="main-nav-link scroll-link" href="#footer" onClick={closeNavHandler}>Información de contacto</a></li>
              <li><Link className="main-nav-link scroll-link invisible-link" to={'/login'} onClick={closeNavHandler}>Login</Link></li>
            </ul>
          )}
          {currentUser?.id && (
            <ul className='main-nav-list'>
              <li><Link className="main-nav-link scroll-link" to={`/profile/${currentUser?.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
              <li><Link className="main-nav-link scroll-link" to={'/create'} onClick={closeNavHandler}>Crear Publicación </Link></li>
              <li><Link className="main-nav-link scroll-link" to={'/logout'} onClick={closeNavHandler}>Salir</Link></li>
            </ul>
          )}
        </nav>
      )}
      {showMenu && window.innerWidth < 900 && (
        <button className="nav__toggle-btn" onClick={() => setIsNavShowing(!isNavShowing)}>
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      )}
    </header>
  );
};

export default Header;
