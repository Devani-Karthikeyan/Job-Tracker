import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaMapMarkerAlt, FaCalendarAlt, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave, FaQuoteLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useJobs } from "../../context/JobContext";

// Helper to format date
const formatKanbanDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return d.toLocaleDateString(undefined, options);
};

const getColumnsFromJobs = (jobsList) => {
  const cols = {
    APPLIED: {
      id: "APPLIED",
      title: "Applied",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      dotColor: "bg-blue-500",
      jobs: [],
    },
    INTERVIEW: {
      id: "INTERVIEW",
      title: "Interview",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      dotColor: "bg-amber-500",
      jobs: [],
    },
    OFFER: {
      id: "OFFER",
      title: "Offer",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
      jobs: [],
    },
    REJECTED: {
      id: "REJECTED",
      title: "Rejected",
      color: "bg-rose-100 text-rose-700 border-rose-200",
      dotColor: "bg-rose-500",
      jobs: [],
    },
  };

  jobsList.forEach((job) => {
    const status = job.status;
    if (status === "APPLIED" || status === "SAVED" || status === "PENDING") {
      cols.APPLIED.jobs.push(job);
    } else if (status === "INTERVIEW") {
      cols.INTERVIEW.jobs.push(job);
    } else if (status === "OFFER" || status === "OFFERED" || status === "ACCEPTED") {
      cols.OFFER.jobs.push(job);
    } else if (status === "REJECTED") {
      cols.REJECTED.jobs.push(job);
    }
  });

  return cols;
};

const KanbanBoard = () => {
  const { allJobs, refreshJobs, loading } = useJobs();
  const navigate = useNavigate();
  const [columns, setColumns] = useState(() => getColumnsFromJobs(allJobs));

  useEffect(() => {
    setColumns(getColumnsFromJobs(allJobs));
  }, [allJobs]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];

    const sourceJobs = [...sourceCol.jobs];
    const destJobs = sourceColId === destColId ? sourceJobs : [...destCol.jobs];

    // Remove job from source list
    const [movedJob] = sourceJobs.splice(source.index, 1);
    
    // Add job to destination list
    destJobs.splice(destination.index, 0, {
      ...movedJob,
      status: destColId, // update local status for immediate visual response
    });

    // Update local state immediately (Optimistic Update)
    const newColumns = {
      ...columns,
      [sourceColId]: { ...sourceCol, jobs: sourceJobs },
      [destColId]: { ...destCol, jobs: destJobs },
    };

    setColumns(newColumns);

    try {
      // API payload requires all job fields with updated status
      const jobToUpdate = allJobs.find((j) => j.id.toString() === draggableId);
      if (!jobToUpdate) throw new Error("Job not found in cache");

      const payload = {
        ...jobToUpdate,
        status: destColId,
      };

      await api.put(`/jobs/${jobToUpdate.id}`, payload);
      refreshJobs();
    } catch (err) {
      console.error("Failed to update status on drag", err);
      alert("Failed to save changes. Restoring previous state...");
      setColumns(getColumnsFromJobs(allJobs)); // restore DB state
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      refreshJobs();
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Pipeline Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">Drag cards to update application status instantly</p>
        </div>
        <button
          onClick={() => navigate("/add-job")}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-300 self-start sm:self-auto"
        >
          <FaPlus className="text-xs" />
          Add Application
        </button>
      </div>

      {loading && allJobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-slate-50 rounded-2xl p-4 border border-slate-100 h-64">
              <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-4"></div>
              <div className="h-10 bg-slate-200 rounded-lg w-full mb-3"></div>
              <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
              <div className="h-6 bg-slate-200 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">
            {Object.values(columns).map((col) => (
              <div
                key={col.id}
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col min-w-[250px] max-h-[70vh] overflow-y-auto"
              >
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                    <h3 className="font-semibold text-gray-800 text-base">{col.title}</h3>
                  </div>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                    {col.jobs.length}
                  </span>
                </div>

                {/* DROPPABLE CONTAINER */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[300px] rounded-xl transition-colors duration-200 space-y-3 ${
                        snapshot.isDraggingOver ? "bg-slate-100/50" : ""
                      }`}
                    >
                      {col.jobs.length > 0 ? (
                        col.jobs.map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform ${
                                  snapshot.isDragging
                                    ? "border-emerald-300 ring-2 ring-emerald-50 shadow-lg scale-[1.02]"
                                    : "border-slate-200 hover:-translate-y-0.5"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold text-gray-800 text-base truncate leading-snug">
                                    {job.jobTitle}
                                  </h4>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => navigate(`/edit-job/${job.id}`)}
                                      className="p-1 text-slate-400 hover:text-slate-600 transition"
                                      title="Edit Application"
                                    >
                                      <FaEdit className="text-[11px]" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                                      title="Delete Application"
                                    >
                                      <FaTrashAlt className="text-[11px]" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-sm font-medium text-gray-500 mt-1 truncate">{job.companyName}</p>

                                {/* Location & Salary */}
                                <div className="mt-3 space-y-1.5 border-t border-slate-50 pt-3">
                                  {job.location && (
                                    <p className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold truncate">
                                      <FaMapMarkerAlt className="text-slate-300" />
                                      {job.location}
                                    </p>
                                  )}
                                  {job.salary && (
                                    <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold truncate">
                                      <FaMoneyBillWave className="text-emerald-400" />
                                      ${job.salary.toLocaleString()} / yr
                                    </p>
                                  )}
                                  <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <FaCalendarAlt className="text-slate-300" />
                                    {formatKanbanDate(job.applicationDate)}
                                  </p>
                                </div>

                                {/* Notes Preview */}
                                {job.notes && (
                                  <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex gap-1.5 items-start">
                                    <FaQuoteLeft className="text-[9px] text-slate-300 shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                      {job.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl py-12">
                          <svg className="w-8 h-8 text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <p className="text-xs font-semibold text-slate-400">No applications in this stage</p>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default KanbanBoard;
