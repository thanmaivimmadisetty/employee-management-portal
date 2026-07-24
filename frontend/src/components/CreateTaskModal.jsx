import React, { useEffect, useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}) {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project_name: "",
    assigned_to: "",
    assigned_by: "",
    priority: "Medium",
    due_date: "",
    estimated_hours: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

const loadEmployees = async () => {
  try {
    const token = localStorage.getItem("emp_portal_token");

    const res = await axios.get(`${API}/api/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Employees API:", res.data);

    if (Array.isArray(res.data)) {
      setEmployees(res.data);
    } else if (Array.isArray(res.data.data)) {
      setEmployees(res.data.data);
    } else if (Array.isArray(res.data.employees)) {
      setEmployees(res.data.employees);
    } else {
      setEmployees([]);
    }
  } catch (err) {
    console.error("Employee Loading Error:", err);
    setEmployees([]);
  }
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      project_name: "",
      assigned_to: "",
      assigned_by: "",
      priority: "Medium",
      due_date: "",
      estimated_hours: "",
    });
  };
  const createTask = async () => {
    try {
      await axios.post(`${API}/api/tasks`, form);

      alert("Task Created Successfully");

      resetForm();

      if (onTaskCreated) {
        onTaskCreated();
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to create task");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 mb-8 w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold text-[#0B4F8A]">
            Create New Task
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2"
          >
            &times;
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
            name="project_name"
            placeholder="Project Name"
            value={form.project_name}
            onChange={handleChange}
          />

          <textarea
            className="border border-blue-300 rounded-lg p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

        <select
  className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
  name="assigned_to"
  value={form.assigned_to}
  onChange={handleChange}
>
  <option value="">Assign Employee</option>

  {employees.length > 0 ? (
    employees.map((emp) => (
      <option
        key={emp.id || emp.employeeId}
        value={emp.id || emp.employeeId}
      >
        {emp.firstName || emp.first_name} {emp.lastName || emp.last_name}
      </option>
    ))
  ) : (
    <option disabled>No Employees Found</option>
  )}
</select>

          <select
            className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
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
            className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />

          <input
            type="number"
            className="border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1AA7EC]"
            name="estimated_hours"
            placeholder="Estimated Hours"
            value={form.estimated_hours}
            onChange={handleChange}
          />
          </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-blue-300 text-[#0B4F8A] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
          >
            Cancel
          </button>

          <button
            onClick={createTask}
            className="flex-1 bg-[#1AA7EC] hover:bg-[#0B4F8A] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            + Create Task
          </button>
        </div>

      </div>
    </div>
  );
}
