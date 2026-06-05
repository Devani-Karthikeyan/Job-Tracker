import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser } from "../features/auth/authService";

const AddJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    status: "APPLIED",
    type: "ONSITE",
    appliedDate: "",
    interviewDate: null,
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
        appliedDate: formData.appliedDate || null,
        interviewDate: formData.interviewDate || null,
      };

      await api.post("/jobs/create", jobData);

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

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="border rounded-lg p-3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACCEPTED">Accepted</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>

          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="date"
            name="interviewDate"
            value={formData.interviewDate || ""}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="5"
            className="border rounded-lg p-3 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg md:col-span-2"
          >
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;