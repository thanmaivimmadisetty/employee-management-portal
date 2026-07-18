import React from "react";

export default function TaskCard({ task }) {

  const priorityColors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Critical: "bg-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200 hover:shadow-lg transition">

      {/* Task Title */}
      <h3 className="text-lg font-bold text-gray-800">
        {task.title}
      </h3>

      {/* Project */}
      <p className="text-sm text-gray-500 mt-1">
        📁 {task.project_name}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-700 mt-3">
        {task.description}
      </p>

      {/* Assigned Employee */}
      <div className="mt-4">
        <span className="font-semibold">
          👤 Assigned To :
        </span>{" "}
        {task.employeeName || "Unassigned"}
      </div>

      {/* Due Date */}
      <div className="mt-2">
        <span className="font-semibold">
          📅 Due Date :
        </span>{" "}
        {task.due_date
          ? new Date(task.due_date).toLocaleDateString()
          : "Not Set"}
      </div>

      {/* Priority */}
      <div className="mt-4">

        <span
          className={`text-white text-xs px-3 py-1 rounded-full ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

      </div>

    </div>
  );
}
