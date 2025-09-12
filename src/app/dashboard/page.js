"use client";

import { Users, Layers, TrendingUp, DollarSign } from "lucide-react";

const dashboardData = [
  {
    title: "Users",
    value: 120,
    icon: <Users className="w-10 h-10 text-white" />,
    bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
  },
  {
    title: "Programs",
    value: 45,
    icon: <Layers className="w-10 h-10 text-white" />,
    bg: "bg-gradient-to-r from-black to-gray-800",
  },
  {
    title: "Progress",
    value: "78%",
    icon: <TrendingUp className="w-10 h-10 text-white" />,
    bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
  },
  {
    title: "Revenue",
    value: "₹12,500",
    icon: <DollarSign className="w-10 h-10 text-white" />,
    bg: "bg-gradient-to-r from-gray-900 to-gray-700",
  },
];

const DashboardPage = () => {
  return (
    <div className="p-8 min-h-screen shadow-lg rounded-xl mx-16 bg-white">
      {/* Header */}
      <h2 className="text-3xl font-bold text-secondary mb-8">
        Welcome Back, <span className="text-primary drop-shadow">Admin</span>
       
      </h2>

      {/* Cards with map() */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default DashboardPage;
