import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Logo from '../Recursos/Logos/Logo.png';
import { UserContext } from '../context/userContext';

const Header = () => {
  const { currentUser } = useContext(UserContext);
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

  useEffect(() => {
    const handleResize = () => {
      setIsNavShowing(window.innerWidth > 800);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="scroll-link" onClick={closeNavHandler}>
        <img className='logo' src={Logo} alt="Logo" />
      </Link> 
      <nav className="main-nav">
        {!currentUser?.id && isNavShowing && (
          <ul className='main-nav-list'>
            <li>
              <a className="main-nav-link scroll-link" href="#commitment">Nuestro Compromiso</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#blogs">Blog</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#TCU">Trabajo Comunal</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#collaborators">Colaboradores</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#footer">Informacion de contacto</a>
            </li>
            <li>
              <Link className="main-nav-link scroll-link" to={'/login'} onClick={closeNavHandler}>Login</Link>
            </li>
          </ul>
        )}
        {currentUser?.id && isNavShowing && (
          <ul className='nav__menu'>
            <li>
              <Link className="main-nav-link scroll-link" to={`/profile/${currentUser?.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link>
            </li>
            <li>
              <Link className="main-nav-link scroll-link" to={'/create'} onClick={closeNavHandler}>Create Post</Link>
            </li>
            <li>
              <Link className="main-nav-link scroll-link" to={'/logout'} onClick={closeNavHandler}>Logout</Link>
            </li>
          </ul>
        )}
      </nav>
      <button className="btn-mobile-nav" onClick={() => setIsNavShowing(prev => !prev)}>
  {isNavShowing ? (
    <AiOutlineClose className="icon-mobile-nav" />
  ) : (
    <FaBars className="icon-mobile-nav" />
  )}
</button>

      </header>
  );
};

export default Header;
