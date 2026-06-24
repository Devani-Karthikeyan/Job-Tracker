import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs font-medium">
        <p className="font-semibold mb-1 text-gray-300">{label}</p>
        <p className="flex justify-between gap-4 text-xs">
          <span>Applications:</span>
          <span className="font-semibold text-blue-400">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ApplicationHistoryChart = ({ jobs = [] }) => {
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];
    const group = {};

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = months[d.getMonth()];
      group[label] = 0;
      result.push(label);
    }

    jobs.forEach((job) => {
      if (!job.applicationDate) return;
      const d = new Date(job.applicationDate);
      const label = months[d.getMonth()];
      if (group[label] !== undefined) {
        group[label]++;
      }
    });

    return result.map((label) => ({
      name: label,
      applications: group[label],
    }));
  };

  const chartData = getChartData();
  const isEmpty = chartData.every((d) => d.applications === 0);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Application History (Past 6 Months)</h3>
      </div>

      <div className="h-[220px] w-full flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center text-gray-400 py-6">
            <svg className="w-10 h-10 mx-auto text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xs font-semibold">No application history</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="applications"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistoryChart;
