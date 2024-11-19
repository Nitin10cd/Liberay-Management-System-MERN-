import React from "react";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Make sure to import useNavigate for redirection

const NavBar = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout");
      if (response.status === 200) {
        alert("Logged out successfully!");
        navigate('/login');  // Redirect to login page after successful logout
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{"fontFamily" : "cursive"}}>Get Your Book </div>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
