import React, { useState } from "react";
import api from "../utils/api";

const Tracker = () => {

  const [task, setTask] = useState({
    task_name: "",
    project_name: "",
    description: "",
    status: "Pending"
  });

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.put("/tracker/task", task);

      alert("Task Updated Successfully!");

      setTask({
        task_name: "",
        project_name: "",
        description: "",
        status: "Pending"
      });

    } catch (err) {
      console.log(err);
      alert("Unable to Save Task");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">

      <h1 className="text-3xl font-bold mb-6">
        Daily Work Tracker
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="task_name"
          placeholder="Task Name"
          value={task.task_name}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          name="project_name"
          placeholder="Project Name"
          value={task.project_name}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          rows="5"
        />

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Save Today's Work
        </button>

      </form>

    </div>
  );
};

export default Tracker;