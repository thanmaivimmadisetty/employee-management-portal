import React, { useEffect, useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

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
  }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load tasks");
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

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Unable to delete task");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Task Management</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 15,
          marginBottom: 25,
          borderRadius: 8
        }}
      >
        <h3>Create Task</h3>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <br />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="project_name"
          placeholder="Project Name"
          value={form.project_name}
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="assigned_to"
          placeholder="Assigned To Employee ID"
          value={form.assigned_to}
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="assigned_by"
          placeholder="Assigned By Employee ID"
          value={form.assigned_by}
          onChange={handleChange}
        />
        <br />
        <br />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <br />
        <br />

        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="estimated_hours"
          placeholder="Estimated Hours"
          value={form.estimated_hours}
          onChange={handleChange}
        />

        <br />
        <br />

        <button onClick={createTask}>Create Task</button>
      </div>

      <h3>Task List</h3>

      {tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Employee</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.project_name}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.employeeName}</td>
                <td>
                  <button onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
