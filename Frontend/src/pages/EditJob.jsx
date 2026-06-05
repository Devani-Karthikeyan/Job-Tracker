import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    status: "APPLIED",
    type: "ONSITE",
    appliedDate: "",
    interviewDate: "",
    notes: "",
  });

  const loadJob = useCallback(async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      setFormData({
        title: res.data.title || "",
        company: res.data.company || "",
        status: res.data.status || "APPLIED",
        type: res.data.type || "ONSITE",
        appliedDate: res.data.appliedDate || "",
        interviewDate: res.data.interviewDate || "",
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
      await api.put(`/jobs/${id}`, formData);

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

          <input name="title" value={formData.title} onChange={handleChange} className="border rounded-lg p-3" />

          <input name="company" value={formData.company} onChange={handleChange} className="border rounded-lg p-3" />

          <select name="status" value={formData.status} onChange={handleChange} className="border rounded-lg p-3">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACCEPTED">Accepted</option>
          </select>

          <select name="type" value={formData.type} onChange={handleChange} className="border rounded-lg p-3">
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>

          <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="border rounded-lg p-3" />

          <input type="date" name="interviewDate" value={formData.interviewDate || ""} onChange={handleChange} className="border rounded-lg p-3" />

          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="5" className="border rounded-lg p-3 md:col-span-2" />

          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg md:col-span-2">
            Update Job
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditJob;