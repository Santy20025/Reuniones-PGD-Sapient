import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {

  const location = useLocation();

  return (
    <nav className="navbar navbar-dark bg-warning bg-gradient navbar-expand-lg shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Reuniones PGD / Sapient</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarTogglerDemo02">
        <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname === '/Home' ? 'active' : ''}`}
          to="/Home"
        >
          Agendar Reuniones
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname === '/pendientes' ? 'active' : ''}`}
          to="/pendientes"
        >
          Reuniones Pendientes
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link ${location.pathname === '/realizadas' ? 'active' : ''}`}
          to="/realizadas"
        >
          Reuniones Realizadas
        </Link>
      </li>
    </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
