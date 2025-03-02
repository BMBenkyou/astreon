import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Keep default styles
import "./CustomCalendar.css"; // Import our Tailwind-based styles

const CustomCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clicking, setClicking] = useState(false);

  const handleDateChange = (date) => {
    if (clicking) {
      if (startDate && endDate) {
        setSelectedDates([]);
        setStartDate(null);
        setEndDate(null);
      } else if (startDate) {
        setEndDate(date);
        setSelectedDates(getSelectedDatesInRange(startDate, date));
      } else {
        setStartDate(date);
      }
      setClicking(false);
    } else {
      const dateString = date.toDateString();
      if (selectedDates.includes(dateString)) {
        setSelectedDates(selectedDates.filter((d) => d !== dateString));
      } else {
        setSelectedDates([...selectedDates, dateString]);
      }
    }
  };

  const handleMouseDown = () => setClicking(true);
  const handleMouseUp = () => setClicking(false);
  const handleClear = () => {
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
    document.activeElement?.blur();
  };

  const isDateSelected = (date) => selectedDates.includes(date.toDateString());

  const getSelectedDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const datesInRange = [];
    while (start <= end) {
      datesInRange.push(new Date(start).toDateString());
      start.setDate(start.getDate() + 1);
    }
    return datesInRange;
  };

  const formatSelectedDateRange = () => {
    if (!startDate && !endDate) return "No dates selected.";
    const formatDate = (date) =>
      `${date.toDateString()} (${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })})`;
    return startDate && !endDate
      ? `Selected Date: ${formatDate(startDate)}`
      : `Selected Range: ${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={handleDateChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        tileClassName={({ date }) => (isDateSelected(date) ? "highlight" : null)}
      />

      <div className="status-container">
        <p>{formatSelectedDateRange()}</p>
      </div>

      <div className="calendar-footer">
        <button className="calendar-clear">
          <span onClick={handleClear}>Clear</span>
        </button>
        <button className="calendar-done">
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};

export default CustomCalendar;
