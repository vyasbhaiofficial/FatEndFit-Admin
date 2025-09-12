"use client";
import React from "react";
import Loader from "@/utils/loader";

const NotFoundCard = ({
  title = "No Data",
  subtitle = "There is nothing to display here yet.",
  className = "",
  action = null,
  loading = false,
}) => {
  return (
    <div className="w-full flex items-center justify-center min-h-[80vh] p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader />
        </div>
      ) : (
        <div
          className={`relative text-center rounded-3xl p-14 bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-xl w-full ${className}`}
        >
          {/* 🔥 Animated Border Overlay */}
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 animate-borderMove" />

          {/* Inner content wrapper to keep bg white */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-700 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm9.75-5.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Zm0 9a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
              {title}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Optional Action */}
            {action && <div className="mt-6">{action}</div>}
          </div>
        </div>
      )}

      {/* 🌀 Animation Keyframes */}
      <style jsx>{`
        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-borderMove {
          background-size: 300% 300%;
          animation: borderMove 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundCard;
