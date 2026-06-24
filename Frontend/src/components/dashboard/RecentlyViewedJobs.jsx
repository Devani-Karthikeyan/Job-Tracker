import { useNavigate } from "react-router-dom";

const RecentlyViewedJobs = ({ jobs = [] }) => {
  const navigate = useNavigate();

  // Get latest 4 jobs
  const latestJobs = [...jobs]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  const getFallbackColor = (name) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
      "bg-indigo-100 text-indigo-700",
    ];
    const code = name.charCodeAt(0) % colors.length;
    return colors[code];
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Recently Viewed Jobs</h4>
        <button
          onClick={() => navigate("/jobs")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View all
        </button>
      </div>

      {latestJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestJobs.map((job) => {
            const companyDomain = job.companyName.toLowerCase().replace(/\s+/g, "") + ".com";
            const logoUrl = `https://logo.clearbit.com/${companyDomain}`;
            const initial = job.companyName.charAt(0).toUpperCase();

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/edit-job/${job.id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer h-40"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt={job.companyName}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      className="w-8 h-8 rounded-lg object-contain border border-gray-100 p-0.5 shrink-0"
                    />
                    <div
                      style={{ display: "none" }}
                      className={`w-8 h-8 rounded-lg items-center justify-center font-semibold text-sm shrink-0 ${getFallbackColor(
                        job.companyName
                      )}`}
                    >
                      {initial}
                    </div>
                    <span className="font-semibold text-gray-800 text-base truncate">{job.companyName}</span>
                  </div>

                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 text-sm truncate leading-snug">{job.jobTitle}</h5>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{job.location || "Remote"}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <button className="w-full text-center py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-gray-100 border-dashed rounded-2xl p-8 text-center text-gray-500">
          <p className="text-sm font-semibold">No recent jobs viewed</p>
          <button
            onClick={() => navigate("/add-job")}
            className="text-xs text-blue-600 font-bold hover:underline mt-1"
          >
            Add your first job application
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedJobs;
