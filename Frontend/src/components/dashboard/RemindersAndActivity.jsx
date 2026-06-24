import { useState } from "react";
import { FaCalendarAlt, FaPlus, FaTimes, FaUserGraduate, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useJobs } from "../../context/JobContext";

const formatDateString = (dateStr) => {
  if (!dateStr) return "Date TBD";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return d.toLocaleDateString(undefined, options);
};

const getRelativeTime = (dateTimeStr) => {
  if (!dateTimeStr) return "Recent";
  const date = new Date(dateTimeStr);
  const now = new Date();
  const diffMs = now - date;

  if (isNaN(diffMs)) return "Recent";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const RemindersAndActivity = ({ jobs = [] }) => {
  const navigate = useNavigate();
  const { refreshJobs } = useJobs();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Interviews: scheduled status, filter to today/future, sort chronologically for nearest first
  const interviews = jobs
    .filter((j) => {
      if (j.status !== "INTERVIEW") return false;
      if (!j.interviewDate) return true; // Include TBD interviews to prompt updates

      const [year, month, day] = j.interviewDate.split("-");
      const iDate = new Date(year, month - 1, day);
      iDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return iDate >= today; // Only show upcoming interviews
    })
    .sort((a, b) => {
      if (!a.interviewDate) return 1;
      if (!b.interviewDate) return -1;
      return new Date(a.interviewDate) - new Date(b.interviewDate);
    })
    .slice(0, 3);

  // Recent activities: sorted by updatedAt or createdAt desc
  const activities = [...jobs]
    .sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const timeB = b.updatedAt ? new Date(b.updatedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return timeB - timeA;
    })
    .slice(0, 4);

  const getActivityDetails = (job) => {
    const isUpdated = job.updatedAt && job.updatedAt !== job.createdAt;
    const time = getRelativeTime(job.updatedAt || job.createdAt);

    switch (job.status) {
      case "INTERVIEW":
        return {
          title: isUpdated ? "Interview Scheduled" : "Added Application",
          desc: `${job.jobTitle} at ${job.companyName}`,
          time,
          color: "bg-amber-500",
          icon: <FaCalendarAlt className="text-white text-[9px]" />,
        };
      case "OFFER":
      case "OFFERED":
      case "ACCEPTED":
        return {
          title: isUpdated ? "Received Offer" : "Added Application",
          desc: `${job.companyName} offered ${job.jobTitle}`,
          time,
          color: "bg-emerald-500",
          icon: <FaUserGraduate className="text-white text-[9px]" />,
        };
      case "REJECTED":
        return {
          title: "Application Ended",
          desc: `${job.companyName} declined (${job.jobTitle})`,
          time,
          color: "bg-rose-500",
          icon: <FaTimes className="text-white text-[9px]" />,
        };
      default:
        return {
          title: "Applied to Job",
          desc: `${job.jobTitle} at ${job.companyName}`,
          time,
          color: "bg-blue-500",
          icon: <FaPlus className="text-white text-[9px]" />,
        };
    }
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    if (!selectedJobId || !interviewDate) {
      alert("Please select a job and set the interview date.");
      return;
    }

    const targetJob = jobs.find((j) => j.id.toString() === selectedJobId);
    if (!targetJob) return;

    setIsSaving(true);
    try {
      const updatedPayload = {
        ...targetJob,
        status: "INTERVIEW",        // Promote to INTERVIEW status
        interviewDate: interviewDate,
        reminderDate: reminderDate || null,
      };

      await api.put(`/jobs/${targetJob.id}`, updatedPayload);
      refreshJobs();
      setShowModal(false);
      setSelectedJobId("");
      setInterviewDate("");
      setReminderDate("");
    } catch (err) {
      console.error("Failed to add interview reminder", err);
      alert("Failed to save reminder.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter jobs that are eligible for reminders (not rejected, not saved/pending if we want to restrict, but generally any active job)
  const eligibleJobs = jobs
    .filter((j) => j.status !== "REJECTED" && j.status !== "OFFER" && j.status !== "ACCEPTED")
    .sort((a, b) => a.companyName.localeCompare(b.companyName));

  // Delete a reminder: clear interviewDate and reminderDate, revert status to APPLIED
  const handleDeleteReminder = async (job) => {
    try {
      const updatedPayload = {
        ...job,
        interviewDate: null,
        reminderDate: null,
        status: "APPLIED",
      };
      await api.put(`/jobs/${job.id}`, updatedPayload);
      refreshJobs();
    } catch (err) {
      console.error("Failed to delete reminder", err);
      alert("Could not remove reminder. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* REMINDERS */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Reminders</h3>
        </div>

        <div className="relative pl-6 border-l border-slate-100 ml-2 space-y-5">
          {interviews.length > 0 ? (
            interviews.map((job) => (
              <div key={job.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border border-white bg-blue-600 flex items-center justify-center text-white p-1 shadow-sm">
                  <FaCalendarAlt className="text-[8px]" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="cursor-pointer flex-1 min-w-0" onClick={() => navigate(`/edit-job/${job.id}`)}>
                    <h4 className="text-sm font-semibold text-gray-800">Upcoming Interview</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5 truncate">
                      {job.jobTitle}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold mt-1 truncate">
                      {job.companyName} · {formatDateString(job.interviewDate)}
                    </p>
                    {job.reminderDate && (
                      <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
                        🔔 Reminder: {formatDateString(job.reminderDate)}
                      </p>
                    )}
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteReminder(job);
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600"
                    title="Remove reminder"
                  >
                    <FaTimes className="text-[9px]" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-left text-gray-500 py-4 -ml-6 pl-6">
              <p className="text-xs font-semibold">No interviews scheduled</p>
              <p className="text-xs text-gray-500 mt-0.5">Your schedule is currently clear.</p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition"
          >
            <FaPlus className="text-[8px]" />
            New
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>

        <div className="relative pl-6 border-l border-slate-100 ml-2 space-y-5">
          {activities.length > 0 ? (
            activities.map((job) => {
              const details = getActivityDetails(job);
              return (
                <div key={job.id} className="relative">
                  {/* Circle dot icon */}
                  <div
                    className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center ${details.color} shadow-sm`}
                  >
                    {details.icon}
                  </div>
                  <div className="cursor-pointer" onClick={() => navigate(`/edit-job/${job.id}`)}>
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{details.title}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5 truncate">{details.desc}</p>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mt-1">
                      {details.time}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-left text-gray-500 py-4 -ml-6 pl-6">
              <p className="text-xs font-semibold">No recent activity</p>
              <p className="text-xs text-gray-500 mt-0.5">Logs will populate when you apply to jobs.</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW INTERVIEW REMINDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-gray-100 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add Interview Reminder</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedJobId("");
                  setInterviewDate("");
                  setReminderDate("");
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Select Applied Job
                </label>
                <div className="relative">
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      const jobId = e.target.value;
                      setSelectedJobId(jobId);
                      const picked = jobs.find((j) => j.id.toString() === jobId);
                      if (picked) {
                        setInterviewDate(picked.interviewDate || "");
                        setReminderDate(picked.reminderDate || "");
                      } else {
                        setInterviewDate("");
                        setReminderDate("");
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none appearance-none focus:border-blue-500 transition cursor-pointer"
                    required
                  >
                    <option value="">-- Select an Application --</option>
                    {eligibleJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.companyName} · {job.jobTitle}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FaChevronDown className="text-xs" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Scheduled Interview Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 transition cursor-pointer"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">The actual date of your interview session.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Set Reminder Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-amber-500 transition cursor-pointer"
                />
                <p className="text-[11px] text-gray-400 mt-1">You'll receive a notification on this date to prepare.</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedJobId("");
                    setInterviewDate("");
                    setReminderDate("");
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersAndActivity;
