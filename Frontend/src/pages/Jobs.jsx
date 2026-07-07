import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";
import JobFilterPanel from "../components/JobFilterPanel";
import JobPriorityBadge from "../components/JobPriorityBadge";
import { useJobs } from "../context/JobContext";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshJobs } = useJobs();

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const urlStatus = searchParams.get("status") || "";

  const [filters, setFilters] = useState({
    status: urlStatus,
    jobType: "",
    sortBy: "applicationDate",
    sortDirection: "desc",
    page: 0,
    size: 10,
  });

  // Keep filters.status synced when searchParams change (navigation between different dashboard clicks)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: searchParams.get("status") || "",
      page: 0,
    }));
  }, [searchParams]);

  const loadJobs = useCallback(async () => {
    try {
      const params = {
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      };

      if (filters.status)  params.status  = filters.status;
      if (filters.jobType) params.jobType = filters.jobType;

      const res = await api.get("/jobs", { params });
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (error) {
      console.log(error);
    }
  }, [filters]);

  // Load this page's (filtered/paginated) view whenever filters change,
  // AND once immediately on mount so data is fresh after navigation.
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? value : 0,
    }));
  };

  const handleReset = () => {
    setFilters({
      status: "",
      jobType: "",
      sortBy: "applicationDate",
      sortDirection: "desc",
      page: 0,
      size: 10,
    });
  };

  const openDeleteModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${selectedJobId}`);
      setShowModal(false);
      // Refresh this page's list AND the global context (Dashboard stats)
      loadJobs();
      refreshJobs();
    } catch (error) {
      console.log(error);
      alert("Failed to delete job");
    }
  };

  // Helper to color statuses elegantly
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPLIED":   return "bg-blue-50 text-blue-700 border-blue-200";
      case "INTERVIEW": return "bg-amber-50 text-amber-700 border-amber-200";
      case "OFFER":     return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":  return "bg-rose-50 text-rose-700 border-rose-200";
      case "SAVED":     return "bg-gray-50 text-gray-700 border-gray-200";
      default:          return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Helper to format enum values cleanly
  const formatEnum = (str) => {
    if (!str) return "";
    return str.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join("-");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Jobs</h1>
          <p className="text-gray-500 mt-1">Manage and track your job applications</p>
        </div>
        <button
          onClick={() => navigate("/add-job")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition duration-200 font-medium shadow-sm"
        >
          Add Job
        </button>
      </div>

      {/* FILTER PANEL */}
      <JobFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Salary</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Priority</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Applied Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50/50 transition duration-150"
                  >
                    <td className="p-4 text-gray-900 font-semibold">
                      {job.companyName}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {job.jobTitle}
                    </td>
                    <td className="p-4 text-gray-500">
                      {job.location || "N/A"}
                    </td>
                    <td className="p-4 text-gray-700">
                      {job.salary ? `$${job.salary.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(job.status)}`}>
                        {formatEnum(job.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <JobPriorityBadge level={job.priorityLevel} score={job.priorityScore} />
                    </td>
                    <td className="p-4 text-gray-500">
                      {formatEnum(job.jobType)}
                    </td>
                    <td className="p-4 text-gray-500">
                      {job.applicationDate || "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-job/${job.id}`)}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(job.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-12 text-gray-500 font-medium">
                    No jobs found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filters.page * filters.size + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min((filters.page + 1) * filters.size, totalElements)}
              </span>{" "}
              of <span className="font-semibold">{totalElements}</span> jobs
            </div>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 0}
                onClick={() => handleFilterChange("page", filters.page - 1)}
                className="px-4 py-2 text-sm border rounded-lg bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                disabled={filters.page === totalPages - 1}
                onClick={() => handleFilterChange("page", filters.page + 1)}
                className="px-4 py-2 text-sm border rounded-lg bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md border border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Job</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this job application? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition font-medium text-sm shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Jobs;