import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useJobs } from "../context/JobContext";

const EditJob = () => {
  const { id } = useParams();
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
    reminderDate: "",
    notes: "",
  });

  const loadJob = useCallback(async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      setFormData({
        jobTitle: res.data.jobTitle || "",
        companyName: res.data.companyName || "",
        location: res.data.location || "",
        status: res.data.status || "APPLIED",
        jobType: res.data.jobType || "FULL_TIME",
        salary: res.data.salary || "",
        applicationDate: res.data.applicationDate || "",
        interviewDate: res.data.interviewDate || "",
        reminderDate: res.data.reminderDate || "",
        notes: res.data.notes || "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load job");
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jobData = {
        ...formData,
        salary: formData.salary ? parseInt(formData.salary, 10) : null,
        applicationDate: formData.applicationDate || null,
        interviewDate: formData.interviewDate || null,
        reminderDate: formData.reminderDate || null,
      };

      await api.put(`/jobs/${id}`, jobData);

      // Update global context so Dashboard stats are instantly current
      refreshJobs();

      alert("Job updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Failed to update job");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Edit Job</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
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

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Reminder Date <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
            <input
              type="date"
              name="reminderDate"
              value={formData.reminderDate || ""}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Get a notification on this date to prepare for the interview.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg md:col-span-2 transition"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;