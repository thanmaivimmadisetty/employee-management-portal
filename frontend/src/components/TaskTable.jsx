import React from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function TaskTable({ tasks }) {
  const priorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-blue-100 text-[#0B4F8A]";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/tasks/${id}`, {
        status,
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Unable to update status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-blue-200 bg-blue-50">

        <h2 className="text-xl font-bold text-[#0B4F8A]">
          Project Tasks
        </h2>

        <span className="bg-[#1AA7EC] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
          {tasks.length} Tasks
        </span>

      </div>

      <table className="w-full">

        <thead className="bg-[#0B4F8A] text-white">

          <tr>
            <th className="px-5 py-4 text-left">Task</th>
            <th className="px-5 py-4 text-left">Assigned To</th>
            <th className="px-5 py-4 text-left">Priority</th>
            <th className="px-5 py-4 text-left">Status</th>
            <th className="px-5 py-4 text-left">Due Date</th>
            <th className="px-5 py-4 text-left">Hours</th>
          </tr>

        </thead>

        <tbody>

          {tasks.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="py-10 text-center text-gray-500"
              >
                No Tasks Available
              </td>

            </tr>

          ) : (

            tasks.map((task) => (

              <tr
                key={task.id}
                className="border-b hover:bg-blue-50 transition duration-200"
              >

                <td className="px-5 py-4">

                  <div className="font-semibold text-[#0B4F8A]">
                    {task.title}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {task.project_name || "No Project"}
                  </div>

                </td>

                <td className="px-5 py-4 font-medium text-gray-700">
                  {task.employeeName || "Unassigned"}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                </td>

                <td className="px-5 py-4">

                  <select
                    value={task.status || "To Do"}
                    onChange={(e) =>
                      updateStatus(task.id, e.target.value)
                    }
                    className="border border-blue-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>

                </td>

                <td className="px-5 py-4 text-gray-700">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {task.estimated_hours
                    ? `${task.estimated_hours} hrs`
                    : "-"}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
