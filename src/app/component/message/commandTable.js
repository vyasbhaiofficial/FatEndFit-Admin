"use client";

import { ActionButton } from "@/utils/actionbutton";
import { API_BASE, API_HOST } from "@/Api/AllApi";

const resolveAudioUrl = (input) => {
  if (!input) return input;
  if (typeof input === "object") {
    const candidate =
      input.url ||
      input.path ||
      input.fileUrl ||
      input.Location ||
      (input.data && (input.data.url || input.data.path)) ||
      null;
    if (candidate) input = candidate;
  }
  let url = String(input).trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(url)) return url;

  if (/^\/?api\/v1\/uploads\//i.test(url)) {
    const rel = url.startsWith("/") ? url : `/${url}`;
    return `${API_HOST}${rel}`;
  }

  const uploadsIdx = url.toLowerCase().indexOf("/uploads/");
  if (uploadsIdx !== -1) {
    const relFromUploads = url.slice(uploadsIdx);
    return `${API_BASE.replace(/\/$/, "")}${relFromUploads}`;
  }

  if (/^uploads\//i.test(url)) {
    return `${API_BASE.replace(/\/$/, "")}/${url}`;
  }

  const lastSlash = url.lastIndexOf("/");
  const fileOnly = lastSlash !== -1 ? url.slice(lastSlash + 1) : url;
  return `${API_BASE.replace(/\/$/, "")}/uploads/${fileOnly}`;
};

import NotFoundCard from "@/components/NotFoundCard";

const CommandTable = ({ commands, onEdit, onDelete }) => {
  if (!commands || commands.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Commands"
          subtitle="Create a command to get started."
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
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description / Audio
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {commands.map((cmd) => (
            <tr
              key={cmd._id}
              className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                {cmd.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cmd.type === "text"
                      ? "bg-yellow-400 text-yellow-800"
                      : "bg-yellow-400 text-yellow-800"
                  }`}
                >
                  {cmd.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {cmd.type === "text" && (
                  <p className="text-sm">{cmd.description}</p>
                )}
                {cmd.type === "audio" && cmd.audioUrl && (
                  <audio controls className="w-full mt-1 rounded-lg  ">
                    <source
                      src={resolveAudioUrl(cmd.audioUrl)}
                      type="audio/mpeg"
                    />
                    Your browser does not support audio.
                  </audio>
                )}
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <ActionButton type="edit" onClick={() => onEdit(cmd)} />
                <ActionButton type="delete" onClick={() => onDelete(cmd._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandTable;
