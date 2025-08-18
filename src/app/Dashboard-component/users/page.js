"use client";

const UsersPage = () => {
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Users <span className="text-yellow-500">List</span>
      </h2>

      {/* Example user list */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between items-center">
            <span className="font-medium text-gray-700">John Doe</span>
            <span className="text-sm text-gray-500">johndoe@gmail.com</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span className="font-medium text-gray-700">Jane Smith</span>
            <span className="text-sm text-gray-500">jane@smith.com</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span className="font-medium text-gray-700">Mike Ross</span>
            <span className="text-sm text-gray-500">mike@ross.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UsersPage;
