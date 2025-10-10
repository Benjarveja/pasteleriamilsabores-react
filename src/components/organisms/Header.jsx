import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/Mil Sabores.png';
import { useAuth } from '../../context/AuthContext';
import AuthDialog from './AuthDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('menu');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const accountMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAccountMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleOpenAuth = (view = 'menu') => {
    setAuthView(view);
    setIsAuthOpen(true);
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleAccountToggle = () => {
    setIsAccountMenuOpen((prev) => !prev);
  };

  const handleAccountOption = (option) => {
    if (option === 'logout') {
      handleLogout();
      return;
    }
    setAuthView(option);
    setIsAuthOpen(true);
    setIsAccountMenuOpen(false);
  };

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`;
  const navButtonClass = ({ isActive }) => `nav-link btn-comprar${isActive ? ' nav-link--active' : ''}`;

  const userInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.trim().toUpperCase() || 'MS'
    : 'MS';
  const greetingName = user?.firstName?.split(' ')[0] ?? user?.email ?? '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo-mobile" onClick={handleNavClick}>
          <img src={logo} alt="Logo pasteleria" />
        </Link>
        <span className="navbar-brand-name">Pastelería Mil Sabores</span>
        <button
          className={`navbar-toggler ${isMenuOpen ? 'is-active' : ''}`}
          id="navbar-toggler"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-links-wrapper ${isMenuOpen ? 'is-active' : ''}`} id="navbar-links-wrapper">
          <ul className="navbar-links-left">
            <li>
              <NavLink end to="/" onClick={handleNavClick} className={navLinkClass}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" onClick={handleNavClick} className={navLinkClass}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/noticias" onClick={handleNavClick} className={navLinkClass}>
                Noticias
              </NavLink>
            </li>
            <li>
              <NavLink to="/nosotros" onClick={handleNavClick} className={navLinkClass}>
                Nosotros
              </NavLink>
            </li>
          </ul>
          <Link to="/" className="navbar-logo-desktop" onClick={handleNavClick}>
            <img src={logo} alt="Logo pasteleria" />
          </Link>
          <ul className="navbar-links-right">
            <li>
              <NavLink to="/faq" onClick={handleNavClick} className={navLinkClass}>
                FAQ
              </NavLink>
            </li>
            <li className="navbar-account">
              {user ? (
                <div
                  className={`navbar-account__profile${isAccountMenuOpen ? ' is-open' : ''}`}
                  ref={accountMenuRef}
                >
                  <button
                    type="button"
                    className="navbar-account__profile-toggle"
                    onClick={handleAccountToggle}
                    aria-expanded={isAccountMenuOpen}
                  >
                    <span className="navbar-account__avatar" aria-hidden="true">
                      {userInitials}
                    </span>
                    <span className="navbar-account__details">
                      <small>Hola</small>
                      <strong>{greetingName}</strong>
                    </span>
                    <span className="navbar-account__caret" aria-hidden="true" />
                  </button>
                  {isAccountMenuOpen ? (
                    <div className="navbar-account__dropdown" role="menu">
                      <button
                        type="button"
                        className="navbar-account__dropdown-item"
                        onClick={() => handleAccountOption('account')}
                      >
                        <span>Mi cuenta</span>
                        <small>Gestiona tus datos y direcciones</small>
                      </button>
                      <button
                        type="button"
                        className="navbar-account__dropdown-item"
                        onClick={() => handleAccountOption('orders')}
                      >
                        <span>Historial de pedidos</span>
                        <small>Revisa el estado de tus órdenes</small>
                      </button>
                      <button
                        type="button"
                        className="navbar-account__dropdown-item"
                        onClick={() => handleAccountOption('purchases')}
                      >
                        <span>Mis compras</span>
                        <small>Resumen de tus productos favoritos</small>
                      </button>
                      <div className="navbar-account__dropdown-separator" role="presentation" />
                      <button
                        type="button"
                        className="navbar-account__dropdown-item navbar-account__dropdown-item--logout"
                        onClick={() => handleAccountOption('logout')}
                      >
                        <span>Salir</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <button type="button" className="navbar-account__login" onClick={() => handleOpenAuth('login')}>
                  Iniciar sesión
                </button>
              )}
            </li>
            <li>
              <NavLink to="/productos" onClick={handleNavClick} className={navButtonClass}>
                Comprar Online
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <AuthDialog
        isOpen={isAuthOpen}
        initialView={authView}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthView('menu');
        }}
      />
    </nav>
  );
};

export default Header;