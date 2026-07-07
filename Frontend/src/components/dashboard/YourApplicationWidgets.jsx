import { useNavigate } from "react-router-dom";

const YourApplicationWidgets = ({ jobs = [] }) => {
  const navigate = useNavigate();

  const total = jobs.length;
  const interviews = jobs.filter((j) => j.status === "INTERVIEW").length;
  const offers = jobs.filter((j) => j.status === "OFFER" || j.status === "ACCEPTED" || j.status === "OFFERED").length;
  const rejected = jobs.filter((j) => j.status === "REJECTED").length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      textColor: "text-blue-700",
      bgGradient: "from-blue-50/40 to-blue-50/10 hover:from-blue-50/70 hover:to-blue-50/20",
      borderColor: "border-blue-100/60 hover:border-blue-300/80",
      iconBg: "bg-blue-100/40",
      iconBorder: "border-blue-200/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: "/jobs",
    },
    {
      label: "Interviews",
      value: interviews,
      textColor: "text-amber-700",
      bgGradient: "from-amber-50/40 to-amber-50/10 hover:from-amber-50/70 hover:to-amber-50/20",
      borderColor: "border-amber-100/60 hover:border-amber-300/80",
      iconBg: "bg-amber-100/40",
      iconBorder: "border-amber-200/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: "/jobs?status=INTERVIEW",
    },
    {
      label: "Offers Received",
      value: offers,
      textColor: "text-emerald-700",
      bgGradient: "from-emerald-50/40 to-emerald-50/10 hover:from-emerald-50/70 hover:to-emerald-50/20",
      borderColor: "border-emerald-100/60 hover:border-emerald-300/80",
      iconBg: "bg-emerald-100/40",
      iconBorder: "border-emerald-200/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      path: "/jobs?status=OFFER",
    },
    {
      label: "Rejected Apps",
      value: rejected,
      textColor: "text-rose-700",
      bgGradient: "from-rose-50/40 to-rose-50/10 hover:from-rose-50/70 hover:to-rose-50/20",
      borderColor: "border-rose-100/60 hover:border-rose-300/80",
      iconBg: "bg-rose-100/40",
      iconBorder: "border-rose-200/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: "/jobs?status=REJECTED",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Application Widgets</h3>
        <p className="text-sm text-gray-500 font-semibold mt-0.5">Consolidate and track all your metrics in one view.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(stat.path)}
            className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-snug">
                  {stat.label}
                </span>
                <span className={`text-3xl font-bold mt-2.5 ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <div className={`p-2 rounded-xl ${stat.iconBg} border ${stat.iconBorder} shadow-sm flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourApplicationWidgets;

