import React from "react";

export default function TaskTable({ tasks }) {

  const priorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-cyan-100 text-cyan-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "Review":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "To Do":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-cyan-200 overflow-hidden">

      <div className="flex justify-between items-center px-6 py-4 border-b bg-cyan-50">
        <h2 className="text-xl font-bold text-cyan-800">
          Project Tasks
        </h2>

        <span className="bg-cyan-700 text-white px-4 py-2 rounded-full text-sm">
          {tasks.length} Tasks
        </span>
      </div>

      <table className="w-full">

        <thead className="bg-cyan-700 text-white">

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
                className="text-center py-10 text-gray-500"
              >
                No Tasks Available
              </td>

            </tr>

          ) : (

            tasks.map((task) => (

              <tr
                key={task.id}
                className="border-b hover:bg-cyan-50 transition duration-200"
              >

                <td className="px-5 py-4">

                  <div className="font-semibold text-gray-800">
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>

                </td>

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(task.status)}`}
                  >
                    {task.status || "To Do"}
                  </span>

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
