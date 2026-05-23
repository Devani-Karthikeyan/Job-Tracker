import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Jobs = () => {

  const [jobs, setJobs] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState(null);

  const navigate = useNavigate();

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

  const openDeleteModal = (jobId) => {

    setSelectedJobId(jobId);

    setShowModal(true);
  };

  const handleDelete = async () => {

    try {

      await api.delete(`/jobs/${selectedJobId}`);

      setJobs(
        jobs.filter(
          (job) => job.id !== selectedJobId
        )
      );

      setShowModal(false);

    } catch (error) {

      console.log(error);

      alert("Failed to delete job");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* PAGE TITLE */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Jobs
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your job applications
          </p>

        </div>

        <button
          onClick={() => navigate("/add-job")}
          className="
            bg-slate-900
            hover:bg-slate-800
            text-white
            px-5
            py-2.5
            rounded-lg
            transition
            duration-200
            font-medium
          "
        >
          Add Job
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-50 border-b">

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Company
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Role
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Type
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {jobs.length > 0 ? (

              jobs.map((job) => (

                <tr
                  key={job.id}
                  className="
                    border-b
                    hover:bg-gray-50
                    transition
                    duration-150
                  "
                >

                  <td className="p-4 text-gray-800 font-medium">
                    {job.company}
                  </td>

                  <td className="p-4 text-gray-700">
                    {job.title}
                  </td>

                  <td className="p-4">

                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        bg-blue-100
                        text-blue-700
                      "
                    >
                      {job.status}
                    </span>

                  </td>

                  <td className="p-4 text-gray-700">
                    {job.type}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      {/* EDIT BUTTON */}

                      <button
                        onClick={() =>
                          navigate(`/edit-job/${job.id}`)
                        }
                        className="
                          px-4
                          py-2
                          rounded-lg
                          border
                          border-slate-300
                          text-slate-700
                          hover:bg-slate-100
                          transition
                          duration-200
                          font-medium
                        "
                      >
                        Edit
                      </button>

                      {/* DELETE BUTTON */}

                      <button
                        onClick={() =>
                          openDeleteModal(job.id)
                        }
                        className="
                          px-4
                          py-2
                          rounded-lg
                          bg-red-600
                          text-white
                          hover:bg-red-700
                          transition
                          duration-200
                          font-medium
                        "
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-10 text-gray-500"
                >
                  No jobs found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* DELETE MODAL */}

      {
        showModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-xl
                p-6
                w-[90%]
                max-w-md
              "
            >

              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Delete Job
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job?
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">

                {/* CANCEL */}

                <button
                  onClick={() => setShowModal(false)}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    text-gray-700
                    hover:bg-gray-100
                    transition
                    duration-200
                    font-medium
                  "
                >
                  Cancel
                </button>

                {/* DELETE */}

                <button
                  onClick={handleDelete}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-red-600
                    text-white
                    hover:bg-red-700
                    transition
                    duration-200
                    font-medium
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default Jobs;