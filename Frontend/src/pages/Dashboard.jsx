import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter(job => job.status === "APPLIED").length;

  const interviewJobs = jobs.filter(job => job.status === "INTERVIEW").length;

  const rejectedJobs = jobs.filter(job => job.status === "REJECTED").length;

  const acceptedJobs = jobs.filter(job => job.status === "ACCEPTED").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Track and manage your job applications
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

        <StatCard label="Total Jobs" value={totalJobs} color="text-slate-800" />

        <StatCard label="Applied" value={appliedJobs} color="text-blue-600" />

        <StatCard label="Interview" value={interviewJobs} color="text-amber-500" />

        <StatCard label="Rejected" value={rejectedJobs} color="text-red-600" />

        <StatCard label="Accepted" value={acceptedJobs} color="text-emerald-600" />

      </div>

      {/* RECENT JOBS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Applications
          </h2>
          <p className="text-gray-500 mt-1">
            Your latest job activities
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Company</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.length > 0 ? (
                jobs.slice(0, 5).map(job => (
                  <tr key={job.id} className="border-b hover:bg-gray-50 transition">

                    <td className="p-4 font-medium text-slate-800">
                      {job.company}
                    </td>

                    <td className="p-4 text-gray-700">
                      {job.title}
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${job.status === "APPLIED" ? "bg-blue-100 text-blue-700" : ""}
                        ${job.status === "INTERVIEW" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${job.status === "REJECTED" ? "bg-red-100 text-red-700" : ""}
                        ${job.status === "ACCEPTED" ? "bg-green-100 text-green-700" : ""}
                      `}>
                        {job.status}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-10 text-gray-500">
                    No recent jobs found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

/* Small reusable component */
const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <h2 className={`text-4xl font-bold mt-3 ${color}`}>{value}</h2>
  </div>
);

export default Dashboard;