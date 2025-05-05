import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import ResetButton from "../components/ResetButton";
import "./streak.css";

// Function to fetch streak data from the Django API
const fetchHeatmapData = async () => {
  try {
    const response = await fetch('/api/activity/heatmap/');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch heatmap data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return [];
  }
};

// Function to fetch statistics data from the Django API
const fetchStatisticsData = async () => {
  try {
    const response = await fetch('/api/activity/statistics/');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch statistics data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching statistics data:', error);
    return [];
  }
};

// Function to record user activity in localStorage
const recordUserActivity = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get existing activity data
  const activityData = JSON.parse(localStorage.getItem('userActivityData') || '{}');
  
  if (!activityData[today]) {
    // First activity of the day
    activityData[today] = 1;
  } else {
    // Increment activity count
    activityData[today] += 1;
  }
  
  // Save updated activity
  localStorage.setItem('userActivityData', JSON.stringify(activityData));
  
  // Return today's updated count
  return activityData[today];
};

// Function to get user's activity history as an array compatible with our streak data format
const getUserActivityHistory = () => {
  const activityData = JSON.parse(localStorage.getItem('userActivityData') || '{}');
  const result = [];
  
  // Create a date 273 days ago (to match your displayed streak window)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 272);
  
  // Generate dates for the past 273 days
  for (let i = 0; i < 273; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push({
      date: dateStr,
      activity: activityData[dateStr] || 0
    });
  }
  
  return result;
};

// Fallback functions for development or when API fails
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
  const [streakData, setStreakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayActivity, setTodayActivity] = useState(0);

  // Record user login activity when component mounts
  useEffect(() => {
    const count = recordUserActivity();
    setTodayActivity(count);
  }, []);

  // Fetch heatmap data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchHeatmapData();
        if (data && data.length > 0) {
          setStreakData(data);
        } else {
          // Fallback to local activity history
          const localData = getUserActivityHistory();
          
          // If local history is empty, use mock data
          setStreakData(localData.some(day => day.activity > 0) ? 
            localData : generateMockStreakData());
        }
        setError(null);
      } catch (err) {
        setError("Failed to load streak data");
        // Fallback to local activity data
        const localData = getUserActivityHistory();
        setStreakData(localData.some(day => day.activity > 0) ? 
          localData : generateMockStreakData());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate current streak
  const calculateCurrentStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    
    // Start from the most recent day and go backward
    for (let i = streakData.length - 1; i >= 0; i--) {
      const day = streakData[i];
      if (day.activity > 0) {
        streak++;
      } else {
        break; // Break the streak on first day with no activity
      }
    }
    
    return streak;
  };

  // Calculate longest streak
  const calculateLongestStreak = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    
    for (const day of streakData) {
      if (day.activity > 0) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  };

  const currentStreak = calculateCurrentStreak();
  const longestStreak = calculateLongestStreak();
  const displayedStreakData = streakData.slice(-273); // Show only last 273 days

  if (loading) {
    return <div className="streak-container">Loading streak data...</div>;
  }

  return (
    <div className="streak-container">
      <h2 className="streak-title">Daily Streak</h2>
      
      <div className="streak-stats">
        <div className="streak-stat-box">
          <span className="streak-label">Current Streak</span>
          <span className="streak-value">{currentStreak} days</span>
        </div>
        <div className="streak-stat-box">
          <span className="streak-label">Longest Streak</span>
          <span className="streak-value">{longestStreak} days</span>
        </div>
        <div className="streak-stat-box">
          <span className="streak-label">Today's Activity</span>
          <span className="streak-value">{todayActivity}</span>
        </div>
      </div>
      
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
      
      <button 
        className="record-activity-btn" 
        onClick={() => {
          const count = recordUserActivity();
          setTodayActivity(count);
          
          // Update today's activity in streak data
          const today = new Date().toISOString().split('T')[0];
          const updatedData = [...streakData];
          const todayIndex = updatedData.findIndex(day => day.date === today);
          
          if (todayIndex >= 0) {
            updatedData[todayIndex].activity = count;
            setStreakData(updatedData);
          }
        }}
      >
        Record Activity
      </button>
    </div>
  );
};

const PerformanceStatistics = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchStatisticsData();
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          // Generate chart data from local activity history
          const activityData = JSON.parse(localStorage.getItem('userActivityData') || '{}');
          
          if (Object.keys(activityData).length > 0) {
            // We have some local activity data, let's use the last 30 days
            const last30Days = [];
            const today = new Date();
            
            for (let i = 29; i >= 0; i--) {
              const date = new Date(today);
              date.setDate(today.getDate() - i);
              const dateStr = date.toISOString().split('T')[0];
              
              last30Days.push({
                day: 30 - i,
                activity: activityData[dateStr] || 0
              });
            }
            
            setChartData(last30Days);
          } else {
            // No local data, use mock data
            const savedData = localStorage.getItem("chartData");
            setChartData(savedData ? JSON.parse(savedData) : generateMockChartData());
          }
        }
        setError(null);
      } catch (err) {
        setError("Failed to load statistics data");
        // Try to use local activity data for the chart
        const activityData = JSON.parse(localStorage.getItem('userActivityData') || '{}');
        
        if (Object.keys(activityData).length > 0) {
          // Use local activity data
          const last30Days = [];
          const today = new Date();
          
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            last30Days.push({
              day: 30 - i,
              activity: activityData[dateStr] || 0
            });
          }
          
          setChartData(last30Days);
        } else {
          // Fallback to mock data
          const savedData = localStorage.getItem("chartData");
          setChartData(savedData ? JSON.parse(savedData) : generateMockChartData());
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    if (chartData.length > 0) {
      localStorage.setItem("chartData", JSON.stringify(chartData));
    }
  }, [chartData]);

  if (loading) {
    return <div className="statistics-container">Loading statistics data...</div>;
  }

  return (
    <div className="statistics-container">
      <h2 className="statistics-title">Performance Statistics</h2>
      <LineChart width={700} height={350} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Activity Level", angle: -90, position: "insideLeft" }} />
        <Tooltip labelFormatter={(label) => `Day ${label}`} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="activity" 
          stroke="#4CAF50" 
          dot={{ r: 4 }} 
          name="Activity Count" 
        />
      </LineChart>
    </div>
  );
};

// Activity tracking service - automatically records page visits
const ActivityTracker = () => {
  useEffect(() => {
    // Record login/page visit
    recordUserActivity();
    
    // Set up event listener for when user leaves the page
    const handleBeforeUnload = () => {
      recordUserActivity(); // Record another activity when leaving
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default function Streak() {
  return (
    <div className="dashboard">
      {/* This component will silently track user activity */}
      <ActivityTracker />
      
      <StreakTracker />
      <PerformanceStatistics />
    </div>
  );
}`:
`