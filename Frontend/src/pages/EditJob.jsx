import { useEffect, useState } from "react";
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

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {

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
  };

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

        <h1 className="text-3xl font-bold mb-8">
          Edit Job
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block mb-2">Job Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2">Company</label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2">Status</label>

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

          <div>
            <label className="block mb-2">Job Type</label>

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

          <div>
            <label className="block mb-2">Applied Date</label>

            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2">Interview Date</label>

            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2">Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="5"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="md:col-span-2">

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              Update Job
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditJob;