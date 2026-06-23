import React from "react";

const JobFilterPanel = ({ filters, onFilterChange, onReset }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Status
          </label>
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2.5 text-sm bg-gray-55 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="SAVED">Saved</option>
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Job Type
          </label>
          <select
            name="jobType"
            value={filters.jobType || ""}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2.5 text-sm bg-gray-55 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        {/* Sorting Options */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sort By
          </label>
          <select
            name="sort"
            value={`${filters.sortBy}-${filters.sortDirection}`}
            onChange={(e) => {
              const [by, dir] = e.target.value.split("-");
              onFilterChange("sortBy", by);
              onFilterChange("sortDirection", dir);
            }}
            className="w-full border rounded-lg p-2.5 text-sm bg-gray-55 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="applicationDate-desc">Application Date (Newest)</option>
            <option value="applicationDate-asc">Application Date (Oldest)</option>
            <option value="salary-desc">Salary (High to Low)</option>
            <option value="salary-asc">Salary (Low to High)</option>
            <option value="companyName-asc">Company Name (A-Z)</option>
            <option value="companyName-desc">Company Name (Z-A)</option>
            <option value="status-asc">Status (A-Z)</option>
          </select>
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilterPanel;
