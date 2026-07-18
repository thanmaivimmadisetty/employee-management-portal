import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskTable from "../components/TaskTable";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    project_name: "",
    assigned_to: "",
    assigned_by: "",
    priority: "Medium",
    due_date: "",
    estimated_hours: ""
  });

  useEffect(() => {
    loadTasks();
    loadEmployees();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem("emp_portal_token");

      const res = await axios.get(`${API}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEmployees(res.data);
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
    try {
      await axios.post(`${API}/api/tasks`, form);

      alert("Task Created Successfully");

      setForm({
        title: "",
        description: "",
        project_name: "",
        assigned_to: "",
        assigned_by: "",
        priority: "Medium",
        due_date: "",
        estimated_hours: ""
      });

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Unable to create task");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const progress = tasks.filter((t) => t.status === "In Progress").length;
  const todo = total - done - progress;

  return (
    <div className="min-h-screen bg-cyan-50 p-6">

      <h1 className="text-4xl font-bold text-cyan-800 mb-6">
        ZLT Task Manager
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-cyan-600">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-3xl font-bold text-cyan-700">{total}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
          <h3 className="text-gray-500">To Do</h3>
          <p className="text-3xl font-bold text-orange-600">{todo}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <h3 className="text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{progress}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <h3 className="text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{done}</p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6 mb-8">

        <h2 className="text-2xl font-semibold text-cyan-800 mb-5">
          Create New Task
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="border border-cyan-300 rounded-lg p-3"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            className="border border-cyan-300 rounded-lg p-3"
            name="project_name"
            placeholder="Project Name"
            value={form.project_name}
            onChange={handleChange}
          />

          <textarea
            className="border border-cyan-300 rounded-lg p-3 md:col-span-2"
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

          <select
            className="border border-cyan-300 rounded-lg p-3"
            name="assigned_to"
            value={form.assigned_to}
            onChange={handleChange}
          >
            <option value="">Assign Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          <select
            className="border border-cyan-300 rounded-lg p-3"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

          <input
            type="date"
            className="border border-cyan-300 rounded-lg p-3"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />

          <input
            type="number"
            className="border border-cyan-300 rounded-lg p-3"
            name="estimated_hours"
            placeholder="Estimated Hours"
            value={form.estimated_hours}
            onChange={handleChange}
          />

        </div>

        <button
          onClick={createTask}
          className="mt-6 bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-3 rounded-lg font-semibold"
        >
          + Create Task
        </button>

      </div>

      <div className="mb-6">

        <input
          type="text"
          placeholder="🔍 Search tasks..."
          className="w-full border border-cyan-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <TaskTable tasks={filteredTasks} />

    </div>
  );
}
