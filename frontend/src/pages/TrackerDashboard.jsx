import React, { useEffect, useState } from "react";
import api from "../utils/api";

const TrackerDashboard = () => {
  const [tracker, setTracker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTracker();
  }, []);

  const fetchTracker = async () => {
    try {
      const res = await api.get("/tracker");
      setTracker(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="p-6 text-xl">Loading...</h2>;
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Employee Tracker Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-blue-600 text-white rounded-lg p-5 shadow-lg">
          <h2 className="text-lg font-semibold">Employees Logged In</h2>
          <p className="text-3xl font-bold mt-2">
            {tracker.length}
          </p>
        </div>

        <div className="bg-green-600 text-white rounded-lg p-5 shadow-lg">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-3xl font-bold mt-2">
            {tracker.filter(item => item.status === "Completed").length}
          </p>
        </div>

        <div className="bg-yellow-500 text-white rounded-lg p-5 shadow-lg">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-3xl font-bold mt-2">
            {tracker.filter(item => item.status === "Pending").length}
          </p>
        </div>

        <div className="bg-indigo-600 text-white rounded-lg p-5 shadow-lg">
          <h2 className="text-lg font-semibold">In Progress</h2>
          <p className="text-3xl font-bold mt-2">
            {tracker.filter(item => item.status === "In Progress").length}
          </p>
        </div>

      </div>

      {/* Search Box */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full md:w-96 shadow-sm"
        />
      </div>

      {/* Tracker Table */}

      <div className="overflow-x-auto">

        <table className="w-full border border-gray-300 shadow-lg">

          <thead className="bg-slate-800 text-white">
<tr>

  <th className="border p-3">Employee</th>

  <th className="border p-3">Activity</th>

  <th className="border p-3">Module</th>

  <th className="border p-3">Login Time</th>

  <th className="border p-3">Logout Time</th>

  <th className="border p-3">Task</th>

  <th className="border p-3">Project</th>

  <th className="border p-3">Status</th>

</tr>

          </thead>

          <tbody>

            {tracker
              .filter(item =>
                `${item.first_name} ${item.last_name}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((item) => (

                <tr
                  key={item.id}
                  className="hover:bg-gray-100 transition"
                >

                  <td className="border p-3 font-medium">
  {item.first_name} {item.last_name}
</td>

<td className="border p-3">
  {item.activity || "-"}
</td>

<td className="border p-3">
  {item.module || "-"}
</td>

<td className="border p-3">
  {item.login_time || "-"}
</td>

<td className="border p-3">
  {item.logout_time || "-"}
</td>

                  <td className="border p-3">
  {item.task_name || "-"}
</td>

<td className="border p-3">
  {item.project_name || "-"}
</td>

<td className="border p-3">
  <span
    className={`px-3 py-1 rounded-full text-white font-semibold ${
      item.status === "Completed"
        ? "bg-green-600"
        : item.status === "In Progress"
        ? "bg-blue-600"
        : "bg-yellow-500"
    }`}
  >
    {item.status}
  </span>
</td>
                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TrackerDashboard;