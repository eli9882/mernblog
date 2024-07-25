import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Logo from '../Recursos/Logos/Logo.png';
import { UserContext } from '../context/userContext';

const Header = () => {
  const { currentUser } = useContext(UserContext);
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

  const closeNavHandler = () => {
    setIsNavShowing(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setIsNavShowing(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="header">
      <Link to="/" className="scroll-link" onClick={closeNavHandler}>
        <img className='logo' src={Logo} alt="Logo" />
      </Link>
      <nav className="main-nav">
        {!currentUser?.id && isNavShowing && (
          <ul className='main-nav-list'>
            <li>
              <a className="main-nav-link scroll-link" href="#commitment" onClick={closeNavHandler}>Nuestro Compromiso</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#blogs" onClick={closeNavHandler}>Blog</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#TCU" onClick={closeNavHandler}>Trabajo Comunal</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#collaborators" onClick={closeNavHandler}>Colaboradores</a>
            </li>
            <li>
              <a className="main-nav-link scroll-link" href="#footer" onClick={closeNavHandler}>Informacion de contacto</a>
            </li>
            <li>
              <Link className="main-nav-link scroll-link" to={'/login'} onClick={closeNavHandler}>Login</Link>
            </li>
          </ul>
        )}
        {currentUser?.id && isNavShowing && (
          <ul className='main-nav-list'>
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
      <button className="nav__toggle-btn" onClick={() => setIsNavShowing(!isNavShowing)}>
        {isNavShowing ? <AiOutlineClose /> : <FaBars />}
      </button>
    </header>
  );
};

export default Header;

