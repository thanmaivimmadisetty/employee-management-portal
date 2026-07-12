import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://employee-management-portal-2.onrender.com";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Management</h2>

      {tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.project_name}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
