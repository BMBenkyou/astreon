import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./calendar.css";
import "./sidebar.css";

export function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState(0);
    const [firstDay, setFirstDay] = useState(0);
    const [schedule, setSchedule] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        updateCalendar();
        fetchSchedule(); // Fetch schedule when component mounts
    }, [currentDate]);

    const fetchSchedule = async () => {
        try {
            const username = localStorage.getItem("username"); // Retrieve username from local storage
            console.log(username)
            if (!username) {
                console.error("Username not found");
                return;
            }
            const response = await fetch(`http://localhost:8000/api/chat/schedule/${username}/`);
            if (response.ok) {
                const data = await response.json();
                setSchedule(data);
            } else {
                console.error("Failed to fetch schedule");
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        }
    }; 

    const updateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        setDaysInMonth(getDaysInMonth(year, month));
        setFirstDay(new Date(year, month, 1).getDay());
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const renderCalendar = () => {
        const calendarDays = [];
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div className="day empty" key={`empty-${i}`}></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day))
                .toISOString()
                .split("T")[0]; // Format date as "YYYY-MM-DD"
            const isScheduled = schedule[date]; // Check if the day has tasks
            const isToday = date === new Date().toISOString().split("T")[0];

            calendarDays.push(
            <div
                className={`day ${isScheduled ? "scheduled" : ""} ${isToday ? "today" : ""}`}
                key={day}
                onClick={() => openModal(date)}
            >
                {day}
                {isScheduled && <div className="dot"></div>} {/* Add a visual indicator */}
            </div>
        );
    }
    return calendarDays;
};
    const changeMonth = (increment) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
        setCurrentDate(newDate);
    };
    const openModal = (date) => {
        setSelectedDay(date);
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const renderTasks = () => {
        if (!selectedDay || !schedule[selectedDay]) return <p>No tasks for this day.</p>;

        return (
        <div className="schedule-grid">
            {schedule[selectedDay].map((task, index) => (
                <div key={index} className="schedule-item">
                    <div className="schedule-time">{task.time}</div>
                    <div className="schedule-description">{task.description}</div>
                </div>
            ))}
        </div>
    );
}; 

    return (
        <div className="body">
            <Header />
            <div className="grid">
                <div className="sidebar">
                <div className="sidebar">
                    <Link to="/chatbox" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/aichat.svg" alt="AI Study" />
                        AI Study
                    </Link>
                    <Link to="/quizme" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/quiz.svg" alt="Quiz Me" />
                        Quiz Me
                    </Link>
                    <Link to="/flashcards" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/cards.svg" alt="Flashcards" />
                        Flashcards
                    </Link>
                    <Link to="/sessions" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/sessions.svg" alt="Sessions" />
                        Sessions
                    </Link>
                    <div className="helpbuttonsdiv">
                        <a className="helplink" href="#">
                            <img className="helpbuttons" src="./imgs/svgs/help.svg" alt="Help" />
                            <p className="phelpbuttons">Help</p>
                        </a>
                    </div>
                    <div className="helpbuttonsdiv">
                        <a className="helplink" href="#">
                            <img className="helpbuttons" src="./imgs/svgs/feedback.svg" alt="Feedback" />
                            <p className="phelpbuttons">Feedback</p>
                        </a>
                    </div>
                </div> 
                </div>

                <div className="main-page-div">
                    <div className="main-age-title-div">
                        <div className="page-title">Daily Progression</div>
                        <hr />
                    </div>
                    <div className="main-div-001">
                        <div className="calendar-border">
                            <div className="calendar-header-title">
                                <div className="calendar-title-div">
                                    <span className="calendar-purpose-name">Normal Calendar</span>
                                </div>
                                <div className="calendar-nav">
                                    <button className="next-buttons-calendar" onClick={() => changeMonth(-1)}>
                                        &lt;
                                    </button>
                                    <span>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
                                    <button className="next-buttons-calendar" onClick={() => changeMonth(1)}>
                                        &gt;
                                    </button>
                                </div>
                            </div>
                            <div className="calendar-grid">
                                <div className="calendar-weekdays">
                                    <div className="weekday">Sun</div>
                                    <div className="weekday">Mon</div>
                                    <div className="weekday">Tues</div>
                                    <div className="weekday">Wed</div>
                                    <div className="weekday">Thurs</div>
                                    <div className="weekday">Fri</div>
                                    <div className="weekday">Sat</div>
                                </div>
                                <div className="calendar-days">{renderCalendar()}</div>
                            </div>
                        </div>

                        {/* Modal for Selected Day Tasks */}
                        {isModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Tasks for {selectedDay || "the day"}</h3>
                                    {renderTasks()}
                                    <button className="close-modal" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}