import React from "react";

export default function TaskCard({ task }) {
  const priorityColor = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-white rounded-xl shadow border p-4 mb-3 hover:shadow-lg transition">

      <h3 className="font-bold text-gray-800">
        {task.title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {task.project_name}
      </p>

      <div className="mt-3 flex justify-between items-center">

        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            priorityColor[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <span className="text-xs text-gray-400">
          {task.employeeName}
        </span>

      </div>

    </div>
  );
}
