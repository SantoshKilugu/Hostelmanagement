import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
      <li><Link to="/">Registration</Link></li>
        {/* <li><Link to="/Pass">CheckOut</Link></li> */}
     
        <li className="dropdown">
          <Link to="/Pass">CheckOut</Link>
          <div className="dropdown-content">
            <Link to="/Pass">GatePass</Link>
            <Link to="/outpass">OutPass</Link>
          </div>
        </li>
        <li className="dropdown">
          <Link to="/Checkingate">CheckIn</Link>
          <div className="dropdown-content">
            <Link to="/checkingate">Gatepass</Link>
            <Link to="/checkinout">Outpass</Link>
          </div>
        </li>
        {/* <li className="dropdown">
          <Link to="/Checkin"></Link>
          <div className="dropdown-content">
            <Link to="/checkingate">Gatepass</Link>
            <Link to="checkinout">Outpass</Link>
          </div>
        </li> */}
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/student-details">Student Details</Link></li>
      </ul>
      {/* <div className="login-section">
        <Link to="/login">Login</Link>
      </div> */}
    </nav>
  );
};

export default Navbar;
