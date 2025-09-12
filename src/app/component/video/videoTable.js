"use client";
import React from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";

import { API_BASE } from "@/Api/AllApi";

export const toAbsolute = (path = "") => {
  try {
    if (!path) return "";
    const base = API_BASE;
    return `${base}/${path.replace(/^\/?/, "")}`;
  } catch {
    return path;
  }
};

const VideoTable = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Videos"
          subtitle="Upload a video to get started."
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-yellow-400 to-amber-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Thumbnail
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Video
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Size (MB)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length > 0 ? (
            items.map((v) => (
              <tr
                key={v._id}
                className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {v.thumbnail ? (
                    <img
                      src={toAbsolute(v.thumbnail)}
                      alt={v.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {v.video ? (
                    <video
                      src={toAbsolute(v.video)}
                      controls
                      className="w-32 h-20 rounded border object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                  {v.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {v.type}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-center">
                  {v.category && v.category.categoryTitle
                    ? v.category.categoryTitle
                    : "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {typeof v.videoSec !== "undefined" ? `${v.videoSec}s` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {typeof v.videoSize !== "undefined" ? v.videoSize : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {v.updatedAt
                    ? new Date(v.updatedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <ActionButton type="edit" onClick={() => onEdit(v)} />
                  <ActionButton type="delete" onClick={() => onDelete(v._id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-6 py-4 text-center text-gray-500 text-sm"
                colSpan={8}
              >
                No Videos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;
