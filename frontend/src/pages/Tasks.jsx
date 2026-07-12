import React, { useEffect, useState } from "react";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project_name: "",
    priority: "Medium"
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createTask = async () => {
    if (!form.title) {
      alert("Please enter task title");
      return;
    }

    try {
      await axios.post(`${API}/api/tasks`, {
        ...form,
        status: "To Do"
      });

      alert("Task Created Successfully");

      setForm({
        title: "",
        description: "",
        project_name: "",
        priority: "Medium"
      });

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Unable to create task");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Jira Task Manager
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Create Task
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            className="border rounded-lg p-2"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-2"
            name="project_name"
            placeholder="Project Name"
            value={form.project_name}
            onChange={handleChange}
          />

          <textarea
            className="border rounded-lg p-2 col-span-2"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <select
            className="border rounded-lg p-2"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

        </div>

        <button
          onClick={createTask}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Create Task
        </button>

      </div>

      <KanbanBoard tasks={tasks} />

    </div>
  );
}
