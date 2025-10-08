"use client";

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Pause } from "lucide-react";
import { getDashboardStats } from "@/Api/AllApi";
import Loader from "@/utils/loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard stats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-white">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const dashboardData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-10 h-10 text-white" />,
      bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
    },
    {
      title: "Active Plans",
      value: stats.activePlanUsers,
      icon: <UserCheck className="w-10 h-10 text-white" />,
      bg: "bg-gradient-to-r from-black to-gray-800",
    },
    {
      title: "Hold Plans",
      value: stats.holdPlanUsers,
      icon: <Pause className="w-10 h-10 text-white" />,
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  // Calculate percentages for chart
  const totalPlans = stats.activePlanUsers + stats.holdPlanUsers;
  const activePercentage =
    totalPlans > 0 ? (stats.activePlanUsers / totalPlans) * 100 : 0;
  const holdPercentage =
    totalPlans > 0 ? (stats.holdPlanUsers / totalPlans) * 100 : 0;

  // Chart data
  const chartData = [
    { name: "Week 1", active: 85, hold: 15 },
    { name: "Week 2", active: 80, hold: 20 },
    { name: "Week 3", active: 75, hold: 25 },
    { name: "Week 4", active: 82, hold: 18 },
    {
      name: "Current",
      active: stats.activePlanUsers,
      hold: stats.holdPlanUsers,
    },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm">
                {entry.dataKey === "active" ? "Active Plans" : "Hold Plans"}:{" "}
                <span className="font-semibold text-yellow-400">
                  {entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 shadow-lg rounded-xl mx-16 bg-white">
      {/* Header */}
      <h2 className="text-3xl font-bold text-secondary mb-8">
        Welcome Back, <span className="text-primary drop-shadow">Admin</span>
      </h2>

      {/* Cards with map() */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardData.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between transform hover:scale-105 transition duration-300 ${item.bg}`}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium opacity-80">{item.title}</div>
              {item.icon}
            </div>
            <p className="text-3xl font-extrabold mt-4">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 my-10 border border-gray-200">
        {/* Plan Status at Top */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Plan Status Distribution
          </h2>
          <p className="text-gray-600">Active vs Hold plan users over time</p>
        </div>

        <div className="flex gap-6">
          {/* Chart Area */}
          <div className="flex-1">
            {/* Recharts Line Chart */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "dataMax + 10"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#1F2937"
                    strokeWidth={3}
                    dot={{ fill: "#1F2937", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#1F2937", strokeWidth: 2 }}
                    name="Active Plans"
                  />
                  <Line
                    type="monotone"
                    dataKey="hold"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2 }}
                    name="Hold Plans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Cards */}
          <div className="flex flex-col gap-4 w-48">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <span className="font-semibold text-gray-800">
                  Active Plans
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.activePlanUsers}
              </div>
              <div className="text-sm text-gray-600">Current Users</div>
              <div className="text-xs text-gray-500">
                {activePercentage.toFixed(1)}% of total
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-gray-800">Hold Plans</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.holdPlanUsers}
              </div>
              <div className="text-sm text-gray-600">Current Users</div>
              <div className="text-xs text-gray-500">
                {holdPercentage.toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
