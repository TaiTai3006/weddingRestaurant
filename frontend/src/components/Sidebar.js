import React from "react";

import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { MdTableChart } from "react-icons/md";
function Sidebar() {
  return (
    <div className="sidebar">
      <a href="/" className="sidebar-link">
        <span className="icon">
          <MdOutlineDashboardCustomize />
        </span>

        
      </a>
      <a href="/booking" className="sidebar-link">
        
        <span className="icon">
        <MdAddBox />
        </span>
       
      </a>
      <a href="/management" className="sidebar-link">
        
        <span className="icon">
        <MdTableChart />
        </span>
        
      </a>
      <a href="" className="sidebar-link">
        
        <span className="icon">
          <FaChartPie /> 
        </span>
      </a>
      <a href="/categorylist" className="sidebar-link">
        
        <span className="icon">
        <FaChartPie />
        </span>
       
      </a>
    </div>
  );
}

export default Sidebar;
