"use client";

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Pause, Star, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/Api/AllApi";
import Loader from "@/utils/loader";
import Dropdown from "@/utils/dropdown";
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
  const [dateRange, setDateRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Initialize sensible defaults when switching to custom
  useEffect(() => {
    if (dateRange === "custom") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      if (!customStartDate)
        setCustomStartDate(sevenDaysAgo.toISOString().split("T")[0]);
      if (!customEndDate) setCustomEndDate(today.toISOString().split("T")[0]);
    }
  }, [dateRange]);

  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case "all":
        return { startDate: null, endDate: null };
      case "7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        };
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return {
          startDate: weekAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        };
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        return {
          startDate: monthAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        };
      case "custom":
        return {
          startDate: customStartDate,
          endDate: customEndDate,
        };
      default:
        return { startDate: null, endDate: null };
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Guard: for custom range, wait until at least one date is selected
        if (dateRange === "custom" && !customStartDate && !customEndDate) {
          setLoading(false);
          return;
        }
        const dateRangeData = getDateRange();
        const data = await getDashboardStats(
          dateRangeData.startDate || null,
          dateRangeData.endDate || null
        );
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
  }, [dateRange, customStartDate, customEndDate]);

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
    {
      title: "Only One Plan",
      value: stats.usersWithOnePlan || 0,
      icon: <Star className="w-10 h-10 text-white" />,
      bg: "bg-gradient-to-r from-amber-800 to-gray-800",
    },
    {
      title: "Upgraded Plan",
      value: stats.usersWithUpgradedPlan || 0,
      icon: <TrendingUp className="w-10 h-10 text-white" />,
      bg: "bg-gradient-to-r from-amber-500 to-amber-600",
    },
  ];

  // Calculate percentages for chart
  const totalPlans = stats.activePlanUsers + stats.holdPlanUsers;
  const activePercentage =
    totalPlans > 0 ? (stats.activePlanUsers / totalPlans) * 100 : 0;
  const holdPercentage =
    totalPlans > 0 ? (stats.holdPlanUsers / totalPlans) * 100 : 0;

  // Chart data - using actual API data with date range context
  const getChartData = () => {
    const dateRangeData = getDateRange();
    const rangeLabel =
      dateRange === "custom"
        ? `${dateRangeData.startDate} to ${dateRangeData.endDate}`
        : dateRange === "7days"
        ? "Last 7 Days"
        : dateRange === "week"
        ? "This Week"
        : dateRange === "month"
        ? "Last 30 Days"
        : "All Time";

    return [
      {
        name: rangeLabel,
        active: stats.activePlanUsers,
        hold: stats.holdPlanUsers,
      },
    ];
  };

  const chartData = getChartData();

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary">
          Welcome Back, <span className="text-primary drop-shadow">Admin</span>
        </h2>

        {/* Date Range Picker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="min-w-[200px]">
              <Dropdown
                options={[
                  { label: "All Time", value: "all" },
                  { label: "Last 7 Days", value: "7days" },
                  { label: "This Week", value: "week" },
                  { label: "Last 30 Days", value: "month" },
                  { label: "Custom Range", value: "custom" },
                ]}
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select range"
              />
            </div>
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                placeholder="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Cards with map() */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
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
          <p className="text-gray-600">
            Active vs Hold plan users for{" "}
            {dateRange === "custom"
              ? `${customStartDate || "?"} to ${customEndDate || "?"}`
              : dateRange === "7days"
              ? "Last 7 Days"
              : dateRange === "week"
              ? "This Week"
              : dateRange === "month"
              ? "Last 30 Days"
              : "All Time"}
          </p>
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
