import React from "react";
import TaskCard from "./TaskCard";

export default function KanbanBoard({ tasks }) {
  const columns = {
    "To Do": [],
    "In Progress": [],
    "Review": [],
    "Done": []
  };

  tasks.forEach((task) => {
    const status = task.status || "To Do";

    if (columns[status]) {
      columns[status].push(task);
    } else {
      columns["To Do"].push(task);
    }
  });

  const colors = {
    "To Do": "border-blue-500",
    "In Progress": "border-yellow-500",
    "Review": "border-purple-500",
    "Done": "border-green-500"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {Object.entries(columns).map(([status, taskList]) => (

        <div
          key={status}
          className={`bg-slate-100 rounded-xl shadow-lg border-t-4 ${colors[status]} p-4 min-h-[550px]`}
        >

          <div className="flex justify-between items-center mb-4">

            <h2 className="font-bold text-lg">
              {status}
            </h2>

            <span className="bg-slate-700 text-white text-xs rounded-full px-3 py-1">
              {taskList.length}
            </span>

          </div>

          {taskList.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No Tasks
            </div>
          ) : (
            taskList.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}

        </div>

      ))}

    </div>
  );
}
