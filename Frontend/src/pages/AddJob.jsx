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

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const user = getUser();

      // CHECK USER LOGIN
      if (!user || !user.id) {
        alert("User not logged in");
        return;
      }

      // CLEAN DATA BEFORE SEND
      const jobData = {
        ...formData,
        appliedDate: formData.appliedDate || null,
        interviewDate: formData.interviewDate || null,
      };

      console.log("Sending Job Data:", jobData);

      // API CALL (MATCH YOUR BACKEND)
      await api.post(
        `/jobs/create/${user.id}`,
        jobData
      );

      alert("Job Added Successfully");

      navigate("/dashboard");

    } catch (error) {

      console.log("ERROR RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Failed to add job");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-2xl shadow-md p-8 w-full">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Add New Job
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* COMPANY */}
          <div>
            <label className="block mb-2 font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="REJECTED">Rejected</option>
              <option value="ACCEPTED">Accepted</option>
            </select>
          </div>

          {/* TYPE (FIXED ENUM) */}
          <div>
            <label className="block mb-2 font-medium">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* APPLIED DATE */}
          <div>
            <label className="block mb-2 font-medium">Applied Date</label>
            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* INTERVIEW DATE */}
          <div>
            <label className="block mb-2 font-medium">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* NOTES */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="5"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              Add Job
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddJob;