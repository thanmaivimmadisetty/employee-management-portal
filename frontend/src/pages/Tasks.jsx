import React, { useEffect, useState } from "react";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";

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

          <input
            className="border rounded-lg p-2"
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-2"
            type="number"
            name="estimated_hours"
            placeholder="Estimated Hours"
            value={form.estimated_hours}
            onChange={handleChange}
          />

        </div>

        <button
          onClick={createTask}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Create Task
        </button>

      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search Tasks..."
          className="border rounded-lg p-3 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <KanbanBoard tasks={filteredTasks} />

    </div>
  );
}
