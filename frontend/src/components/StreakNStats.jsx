import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import ResetButton from "../components/ResetButton";
import "./StreakNStats.css";

const generateMockStreakData = () => {
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  return Array.from({ length: 273 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      activity: Math.floor(Math.random() * 10),
    };
  });
};

const generateMockChartData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    activity: Math.floor(Math.random() * 10),
  }));
};

const StreakTracker = () => {
  const [streakData, setStreakData] = useState(() => {
    const savedData = localStorage.getItem("streakData");
    return savedData ? JSON.parse(savedData) : generateMockStreakData();
  });

  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(streakData));
  }, [streakData]);

  const resetStreakData = () => {
    const newData = generateMockStreakData();
    setStreakData(newData);
  };

  const displayedStreakData = streakData.slice(-273);

  return (
    <div className="streak-container">
      <h2 className="streak-title">Daily Streak</h2>
      <div className="heatmap">
        {displayedStreakData.map((day, index) => (
          <div
            key={index}
            className={`heatmap-cell ${
              day.activity > 7 ? "high" : day.activity > 4 ? "medium" : day.activity > 1 ? "low" : "empty"
            }`}
            title={`${day.date}: ${day.activity} activities`}
          ></div>
        ))}
      </div>
      <div className="legend">
        <span>Less</span>
        <div className="legend-box empty"></div>
        <div className="legend-box low"></div>
        <div className="legend-box medium"></div>
        <div className="legend-box high"></div>
        <span>More</span>
      </div>

      {/* Using ResetButton Component */}
      <ResetButton onClick={resetStreakData} />
    </div>
  );
};



document.addEventListener("DOMContentLoaded", function () {
  const heatmap = document.querySelector(".heatmap");
  if (!heatmap) {
    console.error("Heatmap container not found!");
    return;
  }
  for (let i = 0; i < 365; i++) {
    let cell = document.createElement("div");
    cell.classList.add("heatmap-cell", "empty"); // Default state
    heatmap.appendChild(cell);
  }
});

const PerformanceStatistics = () => {
  const [chartData, setChartData] = useState(() => {
    const savedData = localStorage.getItem("chartData");
    return savedData ? JSON.parse(savedData) : generateMockChartData();
  });

  useEffect(() => {
    localStorage.setItem("chartData", JSON.stringify(chartData));
  }, [chartData]);

  return (
    <div className="statistics-container">
      <h2 className="statistics-title">Performance Statistics</h2>
      <LineChart width={700} height={350} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Activity Level", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="activity" stroke="#4CAF50" dot={{ r: 4 }} />
      </LineChart>
    </div>
  );
};

export default function Streak() {
  return (
    <div className="dashboard">
      <StreakTracker />
      <PerformanceStatistics />
    </div>
  );
}
