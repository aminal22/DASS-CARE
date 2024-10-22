import React, { useState } from "react";
import "./navbar.css";
const Navbar = ({ setLogin }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="#">DASS CARE</a>
      </div>
      <div className="navbar-right">
        <a href="#" onClick={() => setLogin(true)}>
          Sign in
        </a>
        <a href="#" onClick={() => setLogin(false)}>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Navbar;
