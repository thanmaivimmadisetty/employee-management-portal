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
    if (columns[task.status]) {
      columns[task.status].push(task);
    } else {
      columns["To Do"].push(task);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {Object.keys(columns).map((status) => (

        <div
          key={status}
          className="bg-slate-100 rounded-xl p-4 min-h-[500px]"
        >

          <h2 className="font-bold text-lg mb-4">
            {status}
          </h2>

          {columns[status].length === 0 ? (
            <p className="text-gray-400 text-sm">
              No Tasks
            </p>
          ) : (
            columns[status].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))
          )}

        </div>

      ))}

    </div>
  );
}
