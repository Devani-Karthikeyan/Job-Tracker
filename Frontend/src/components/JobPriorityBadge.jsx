import React from 'react';

const JobPriorityBadge = ({ level, score }) => {
    let colorClass = 'bg-gray-100 text-gray-800'; // Default LOW
    
    if (level === 'HIGH') {
        colorClass = 'bg-red-100 text-red-800 border-red-200';
    } else if (level === 'MEDIUM') {
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (level === 'LOW') {
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
    }

    if (!level) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
                UNRATED
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {level} {score !== undefined && score !== null ? `(${score})` : ''}
        </span>
    );
};

export default JobPriorityBadge;
