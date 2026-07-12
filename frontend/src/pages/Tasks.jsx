import React, { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks([
      {
        id: 1,
        title: "Design Login Page",
        description: "Create responsive login UI",
        project_name: "Employee Portal",
        priority: "High",
        status: "To Do",
        employeeName: "Rahul Sharma",
      },
      {
        id: 2,
        title: "Employee CRUD Module",
        description: "Develop employee management",
        project_name: "Employee Portal",
        priority: "Medium",
        status: "In Progress",
        employeeName: "Priya Singh",
      },
      {
        id: 3,
        title: "Payroll Reports",
        description: "Generate monthly payroll",
        project_name: "Employee Portal",
        priority: "Low",
        status: "Done",
        employeeName: "Amit Kumar",
      },
      {
        id: 4,
        title: "Attendance Dashboard",
        description: "Create attendance analytics",
        project_name: "Employee Portal",
        priority: "Critical",
        status: "To Do",
        employeeName: "Neha Reddy",
      },
      {
        id: 5,
        title: "Leave Approval",
        description: "HR leave workflow",
        project_name: "Employee Portal",
        priority: "High",
        status: "In Progress",
        employeeName: "Arjun Patel",
      },
      {
        id: 6,
        title: "Recruitment Tracker",
        description: "Candidate tracking system",
        project_name: "Employee Portal",
        priority: "Medium",
        status: "Done",
        employeeName: "Sneha Rao",
      }
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Jira Task Manager
      </h1>

      <KanbanBoard tasks={tasks} />
    </div>
  );
}
