import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser } from "../features/auth/authService";
import { useJobs } from "../context/JobContext";

const AddJob = () => {
  const navigate = useNavigate();
  const { refreshJobs } = useJobs();

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    status: "APPLIED",
    jobType: "FULL_TIME",
    salary: "",
    applicationDate: "",
    interviewDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = getUser();

      const jobData = {
        ...formData,
        userId: user?.id, 
        salary: formData.salary ? parseInt(formData.salary, 10) : null,
        applicationDate: formData.applicationDate || null,
        interviewDate: formData.interviewDate || null,
      };

      await api.post("/jobs/create", jobData);

      // Update global context so Dashboard stats are instantly current
      refreshJobs();

      alert("Job Added Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Failed to add job");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Add New Job
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="border rounded-lg p-3 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Company</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="border rounded-lg p-3 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mountain View, CA / Remote"
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Salary ($/yr)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="SAVED">Saved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="FULL_TIME">Full-Time</option>
              <option value="PART_TIME">Part-Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Application Date</label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate || ""}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add key details, interview prep, contacts, etc."
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg md:col-span-2 transition"
          >
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;