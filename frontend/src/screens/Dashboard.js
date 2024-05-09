import React, { useState,useEffect } from "react";
import "../style/dashboard.css";
import { MdAdd } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { FaListUl } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { BarChart } from "@mui/x-charts/BarChart";
import axios from 'axios';


const Dashboard = () => {
  const [jobData, setJobData] = useState(null);
  const token = '810a608d6e0d12f96e565716c85407a08dc098bc' ;
  const apiUrl = 'http://127.0.0.1:8000/job/';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setJobData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(jobData)
  const projectsData = [
    {
      id: 1,
      name: "Project A",
      date: "2024-04-30",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 2,
      status: "preparing",
    },
    {
      id: 2,
      name: "Project B",
      date: "2024-04-30",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 3,
      status: "organizing",
    },
    {
      id: 3,
      name: "Project B",
      date: "2024-04-30",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 3,
      status: "vacant",
    },
    {
      id: 4,
      name: "Project A",
      date: "2024-04-30",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 2,
      status: "preparing",
    },
    {
      id: 5,
      name: "Project B",
      date: "2024-05-01",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 3,
      status: "organizing",
    },
    {
      id: 6,
      name: "Project B",
      date: "2024-04-30",
      participants: [
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
        "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80",
      ],
      daysLeft: 3,
      status: "vacant",
    },
    // Add more project data objects as needed
  ];

  // Define a mapping between project statuses and background colors
  const statusColors = {
    preparing: "#d5deff",
    organizing: "#fee4cb",
    vacant: "#c8f7dc",
    // Add more status-color pairs as needed
  };

  const statusCounts = projectsData.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const currentDate = dayjs();
  const formattedDate = currentDate.format("YYYY-MM-DD");

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewType, setViewType] = useState("grid");

  const toggleViewType = () => {
    setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
  };

  const filteredProjects = projectsData.filter((project) => {
    const projectDate = dayjs(project.date, "YYYY-MM-DD");

    return projectDate.isSame(selectedDate, "day");
  });
  // Định nghĩa tất cả các tình trạng dự án có thể có
  const allStatuses = ["preparing", "organizing", "vacant"];

  const projectCountsByStatus = allStatuses.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  filteredProjects.forEach((project) => {
    projectCountsByStatus[project.status]++;
  });

  return (
    <div className="container">
      <div className="content">
        <div class="projects-section">
          <div class="projects-section-header">
            <p>Trạng thái các sảnh </p>
            <p class="time">{formattedDate}</p>
          </div>
          <div class="projects-section-line">
            <div class="projects-status">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} class="item-status">
                  <span class="status-number">{count}</span>
                  <span class="status-type">
                    {status === "preparing"
                      ? "Đang chuẩn bị"
                      : status === "organizing"
                      ? "Đang tổ chức"
                      : "Sảnh trống"}
                  </span>
                </div>
              ))}
            </div>
            <div class="view-actions">
              <button
                className={`icon view-btn ${
                  viewType === "list" ? "active" : ""
                }`}
                onClick={toggleViewType}
                title="List View"
              >
                <FaListUl />
              </button>
              <button
                className={`icon view-btn ${
                  viewType === "grid" ? "active" : ""
                }`}
                onClick={toggleViewType}
                title="Grid View"
              >
                <BsFillGrid3X3GapFill />
              </button>
            </div>
          </div>
          <div
            className={
              viewType === "grid" ? "project-boxes-grid" : "project-boxes-list"
            }
          >
            
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-box-wrapper">
                  <div
                    className="project-box"
                    style={{ backgroundColor: statusColors[project.status] }}
                  >
                    <div className="project-box-header">
                      <span>{project.date}</span>
                      <div className="icon more" title="More">
                        <IoMdMore />
                      </div>
                    </div>
                    <div className="project-box-content-header">
                      <p className="box-content-header">{project.name}</p>
                      <p className="box-content-subheader">
                        Tình trạng: {project.status}
                      </p>
                    </div>
                    <div className="project-box-footer">
                      <div className="participants">
                        {project.participants.map((participant, index) => (
                          <img
                            key={index}
                            src={participant}
                            alt={`participant-${index}`}
                          />
                        ))}
                        <button
                          className="add-participant"
                          style={{ color: "#4067f9" }}
                        >
                          <MdAdd />
                        </button>
                      </div>
                      <div className="days-left" style={{ color: "#4067f9" }}>
                        {project.daysLeft} Days Left
                      </div>
                    </div>
                  </div>
                </div>
              ))}
           
          </div>
        </div>
        <div className="report-section">
          <div>
            <div className="projects-section-header">
              <p>Báo cáo</p>
            </div>
            <div className="calender">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </LocalizationProvider>
            </div>
            {Object.entries(projectCountsByStatus).map(([status, count]) => (
              <div key={status}>
                <p>
                  {status}: {count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
