import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Keep default styles
import "./CustomCalendar.css"; // Import our Tailwind-based styles

const CustomCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (date) => {
    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
      setSelectedDates([date.toDateString()]);
    } else if (startDate) {
      setEndDate(date);
      setSelectedDates(getSelectedDatesInRange(startDate, date));
    } else {
      setStartDate(date);
      setSelectedDates([date.toDateString()]);
    }
  };

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
    if (!startDate) return "No dates selected.";
    const formatDate = (date) =>
      `${date.toDateString()} (${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })})`;

    return endDate
      ? `Selected Range: ${formatDate(startDate)} - ${formatDate(endDate)}`
      : `Selected Date: ${formatDate(startDate)}`;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={handleDateChange}
        tileClassName={({ date }) => (isDateSelected(date) ? "highlight" : null)}
      />
      <div className="status-container">
        <p>{formatSelectedDateRange()}</p>
      </div>
      <div className="calendar-footer">
        <button className="calendar-clear" onClick={handleClear}>Clear</button>
        <button className="calendar-done">Done</button>
      </div>
    </div>
  );
};

export default CustomCalendar;
