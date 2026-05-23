import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { getUser } from "../features/auth/authService";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const user = getUser();

    // prevent crash if no user
    if (!user) return;

    try {
      const res = await api.get(`/jobs/user/${user.id}`);
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalJobs = jobs.length;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <div className="bg-blue-500 text-white p-4 rounded mb-4">
        Total Jobs: {totalJobs}
      </div>

      <div className="bg-white shadow rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Your Jobs
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Company</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="p-2">{job.company}</td>
                <td className="p-2">{job.title}</td>
                <td className="p-2">{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Dashboard;