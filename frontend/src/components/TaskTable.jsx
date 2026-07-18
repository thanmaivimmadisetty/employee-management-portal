import React from "react";

export default function TaskTable({ tasks }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-cyan-700 text-white">

          <tr>

            <th className="p-3 text-left">Task</th>

            <th className="p-3 text-left">Assigned To</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">Priority</th>

            <th className="p-3 text-left">Due Date</th>

          </tr>

        </thead>

        <tbody>

          {tasks.map((task) => (

            <tr
              key={task.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-3">
                <strong>{task.title}</strong>

                <br />

                <span className="text-gray-500 text-sm">
                  {task.project_name}
                </span>

              </td>

              <td className="p-3">
                {task.employeeName || "Unassigned"}
              </td>

              <td className="p-3">

                {task.status}

              </td>

              <td className="p-3">

                {task.priority}

              </td>

              <td className="p-3">

                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "-"}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
