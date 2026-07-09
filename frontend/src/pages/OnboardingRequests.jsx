import React, { useEffect, useState } from "react";
import api from "../utils/api";

const OnboardingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/onboarding");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/onboarding/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <h2 className="p-6">Loading...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Employee Onboarding Requests
      </h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Previous Company</th>
            <th className="border p-2">New Designation</th>
            <th className="border p-2">Experience</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-4">
                No Requests Found
              </td>
            </tr>
          ) : (
            requests.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.full_name}</td>
                <td className="border p-2">{item.email}</td>
                <td className="border p-2">{item.phone}</td>
                <td className="border p-2">{item.previous_company}</td>
                <td className="border p-2">{item.new_designation}</td>
                <td className="border p-2">{item.experience} Years</td>

                <td className="border p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      item.status === "Approved"
                        ? "bg-green-600"
                        : item.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="border p-2 text-center">
                  <a
                    href={`mailto:${item.email}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Contact
                  </a>
                </td>

                <td className="border p-2 text-center">
                  <button
                    onClick={() => updateStatus(item.id, "Approved")}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "Rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardingRequests;