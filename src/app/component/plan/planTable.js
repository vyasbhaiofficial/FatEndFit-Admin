"use client";
import { ActionButton } from "@/utils/actionbutton";
import NotFoundCard from "@/components/NotFoundCard";

const PlanTable = ({ plans, onEdit, onDelete }) => {
  if (!plans || plans.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Plans"
          subtitle="Create a plan to get started."
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
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {plans.map((p) => (
            <tr
              key={p._id}
              className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                {p.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {p.days}
              </td>
              <td className="px-6 py-4 text-gray-700">
                <p className="text-sm">{p.description}</p>
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <ActionButton type="edit" onClick={() => onEdit(p)} />
                <ActionButton type="delete" onClick={() => onDelete(p._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
