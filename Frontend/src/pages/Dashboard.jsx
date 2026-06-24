import { useState } from "react";
import { useJobs } from "../context/JobContext";
import RecentlyViewedJobs from "../components/dashboard/RecentlyViewedJobs.jsx";
import YourApplicationWidgets from "../components/dashboard/YourApplicationWidgets.jsx";
import ApplicationHistoryChart from "../components/dashboard/ApplicationHistoryChart.jsx";
import RemindersAndActivity from "../components/dashboard/RemindersAndActivity.jsx";
import KanbanBoard from "../components/dashboard/KanbanBoard.jsx";

const Dashboard = () => {
  const { allJobs } = useJobs();
  const [activeTab, setActiveTab] = useState("overview"); // overview or kanban

  const getCurrentDateString = () => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* TABS SELECTOR */}
      <div className="flex border-b border-gray-200 gap-6 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 font-semibold text-base transition-all relative ${
            activeTab === "overview" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Dashboard
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("kanban")}
          className={`pb-3 font-semibold text-base transition-all relative ${
            activeTab === "kanban" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Job Pipeline (Kanban)
          {activeTab === "kanban" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-3 items-start">
          {/* MAIN LEFT COLUMN */}
          <div className="xl:col-span-7 space-y-3">
            {/* WELCOME / RECENTLY VIEWED HEADER CARD */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Job Applications Dashboard</h2>
                  <p className="text-sm text-gray-500 font-semibold mt-0.5">Track and Status Overview</p>
                </div>
                {/* DATE BADGE */}
                <div className="self-start sm:self-auto">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl shadow-sm">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {getCurrentDateString()}
                  </span>
                </div>
              </div>
              <RecentlyViewedJobs jobs={allJobs} />
            </div>

            {/* WIDGETS & CHART GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <YourApplicationWidgets jobs={allJobs} />
              <ApplicationHistoryChart jobs={allJobs} />
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="xl:col-span-3">
            <RemindersAndActivity jobs={allJobs} />
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE BOARD */
        <KanbanBoard />
      )}
    </div>
  );
};

export default Dashboard;