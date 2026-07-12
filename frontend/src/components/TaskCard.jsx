import React from "react";

export default function TaskCard({ task }) {

  const priorityColor = {
    Low: "bg-green-500",
    Medium: "bg-blue-500",
    High: "bg-orange-500",
    Critical: "bg-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border">

      <h3 className="font-bold text-lg">
        {task.title}
      </h3>

      <p className="text-gray-600 text-sm mt-2">
        {task.description}
      </p>

      <div className="mt-4 space-y-2">

        <p>
          <strong>👤 Employee:</strong>{" "}
          {task.employeeName || "Unassigned"}
        </p>

        <p>
          <strong>📁 Project:</strong>{" "}
          {task.project_name}
        </p>

        <p>
          <strong>📅 Due:</strong>{" "}
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "No Due Date"}
        </p>

        <span
          className={`text-white px-3 py-1 rounded-full text-xs ${
            priorityColor[task.priority]
          }`}
        >
          {task.priority}
        </span>

      </div>

    </div>
  );
}
