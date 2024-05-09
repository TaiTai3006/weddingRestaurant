import React from "react";
import "../style/dashboard.css";
import { BsSearch } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";

function Header() {
  return (
    
      <div className="header">
        <div className="header-left">
          <span className="icon"></span>
          <p className="name">Restaurant</p>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Search" />
            <BsSearch />
          </div>
        </div>
        <div className="header-right">
          
          <button className="icon add-btn" title="Add New Project">
            <MdAdd />
          </button>
          <button className="icon notification-btn" title="Notice">
            <FaRegBell />
          </button>
          <button className="profile-btn">
            <img
              src="https://assets.codepen.io/3306515/IMG_2025.jpg"
              alt="profile"
            />
            <span>LêThiep</span>
          </button>
        </div>
      </div>
    
  );
}

export default Header;
