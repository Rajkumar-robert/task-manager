import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { analyticsAPI } from '../../api/analyticsApi';
import '../../styles/Dashboard.css';
import { TaskStats, TrendData } from '../../types/analytics';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData] = await Promise.all([
        analyticsAPI.getTaskStats(),
        analyticsAPI.getTaskTrends()
      ]);
      setStats(statsData);
      setTrends(trendsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Helper functions to get counts based on your API response
  const getStatusCount = (status: string) => {
    if (!stats?.statusStats) return 0;
    const stat = stats.statusStats.find(s => s._id === status);
    return stat ? stat.count : 0;
  };

  const getPriorityCount = (priority: string) => {
    if (!stats?.priorityStats) return 0;
    const stat = stats.priorityStats.find(p => p._id === priority);
    return stat ? stat.count : 0;
  };

  const getTotalTasks = () => {
    if (!stats?.statusStats) return 0;
    return stats.statusStats.reduce((total, stat) => total + stat.count, 0);
  };

  const getMonthName = (monthNumber: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  };

  if (loading) return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="dashboard-content">
        <div className="loading">Loading dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="dashboard-content">
        <div className="error">Error: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard"> 
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}!</h1>
          <p>Here's your task management overview</p>
        </div>

        {/* Task Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total Tasks</h3>
            <div className="stat-number">{getTotalTasks()}</div>
            <p>All tasks across all statuses</p>
          </div>

          <div className="stat-card todo">
            <h3>To Do</h3>
            <div className="stat-number">{getStatusCount('todo')}</div>
            <p>Tasks waiting to start</p>
          </div>

          <div className="stat-card progress">
            <h3>In Progress</h3>
            <div className="stat-number">{getStatusCount('in-progress')}</div>
            <p>Currently working on</p>
          </div>

          <div className="stat-card completed">
            <h3>Completed</h3>
            <div className="stat-number">{getStatusCount('completed')}</div>
            <p>Finished tasks</p>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="analytics-section">
          <h2>Priority Distribution</h2>
          <div className="priority-grid">
            <div className="priority-item high">
              <span className="priority-label">High Priority</span>
              <span className="priority-count">{getPriorityCount('high')}</span>
            </div>
            <div className="priority-item medium">
              <span className="priority-label">Medium Priority</span>
              <span className="priority-count">{getPriorityCount('medium')}</span>
            </div>
            <div className="priority-item low">
              <span className="priority-label">Low Priority</span>
              <span className="priority-count">{getPriorityCount('low')}</span>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="analytics-section">
          <h2>Monthly Task Trends</h2>
          {trends.length === 0 ? (
            <div className="no-data">No task data available for trends analysis</div>
          ) : (
            <div className="trends-grid">
              {trends.map(trend => (
                <div key={trend.month} className="trend-item">
                  <div className="month">{getMonthName(trend.month)}</div>
                  <div className="trend-bar">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(trend.count / Math.max(...trends.map(t => t.count))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="trend-count">{trend.count} tasks</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;