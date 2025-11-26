"use client";

import { useState, useEffect } from "react";

interface ActivityItem {
  type: string;
  message: string;
  date: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalStates: number;
  totalInvestors: number;
  totalAdmins: number;
  recentActivity: string[];
  recentActivityDetailed?: ActivityItem[];
}

interface AdminOverviewTabProps {
  onQuickAction?: (tabName: string, action: string) => void;
}

export default function AdminOverviewTab({
  onQuickAction,
}: AdminOverviewTabProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalStates: 0,
    totalInvestors: 0,
    totalAdmins: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error("API error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return "👤";
      case "property_created":
        return "🏢";
      case "document_uploaded":
        return "📄";
      case "user_assigned":
        return "🔗";
      default:
        return "📊";
    }
  };

  if (loading) {
    return (
      <div className="luxury-card p-8 text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
          style={{ borderBottomColor: "#5c9c45" }}
        ></div>
        <p className="mt-4 text-slate-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="luxury-card p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Welcome to the Admin Dashboard
        </h2>
        <p className="text-slate-600">
          Manage users, properties, and documents from this central hub.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="luxury-card p-6">
          <div className="flex items-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#e8f5e8", color: "#5c9c45" }}
            >
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-evenly">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Properties
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalProperties}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">States</p>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalStates}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="luxury-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-evenly">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Total Users
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Investors
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalInvestors}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">Admins</p>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalAdmins}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="luxury-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="btn-primary flex items-center justify-center space-x-2 p-4"
            onClick={() => onQuickAction?.("users", "create")}
          >
            <span>Add New User</span>
          </button>
          <button
            className="btn-primary flex items-center justify-center space-x-2 p-4"
            onClick={() => onQuickAction?.("properties", "create")}
          >
            <span>Add New Property</span>
          </button>
          <button
            className="btn-primary flex items-center justify-center space-x-2 p-4"
            onClick={() => onQuickAction?.("documents", "upload")}
          >
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="luxury-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Activity
        </h3>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivityDetailed &&
            stats.recentActivityDetailed.length > 0
              ? stats.recentActivityDetailed.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-lg flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatRelativeTime(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              : stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#5c9c45" }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{activity}</p>
                    </div>
                  </div>
                ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 text-4xl mb-2">📊</div>
            <p className="text-slate-500">No recent activity to display.</p>
            <p className="text-xs text-slate-400 mt-1">
              Activity from the last 30 days will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
