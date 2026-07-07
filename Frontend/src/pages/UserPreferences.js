import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../api/preferencesApi';
import { toast } from 'react-toastify';

const UserPreferences = () => {
    const [preferences, setPreferences] = useState({
        preferredCompanies: [],
        preferredLocations: [],
        preferredWorkTypes: [],
        preferredEmploymentTypes: [],
        expectedMinimumSalary: '',
        preferredIndustries: [],
        skills: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const data = await getPreferences();
                setPreferences({
                    preferredCompanies: data.preferredCompanies || [],
                    preferredLocations: data.preferredLocations || [],
                    preferredWorkTypes: data.preferredWorkTypes || [],
                    preferredEmploymentTypes: data.preferredEmploymentTypes || [],
                    expectedMinimumSalary: data.expectedMinimumSalary || '',
                    preferredIndustries: data.preferredIndustries || [],
                    skills: data.skills || []
                });
            } catch (error) {
                toast.error("Failed to load preferences");
            } finally {
                setLoading(false);
            }
        };
        fetchPreferences();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value;
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== "");
        setPreferences(prev => ({
            ...prev,
            [field]: arrayValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePreferences(preferences);
            toast.success("Preferences updated successfully!");
        } catch (error) {
            toast.error("Failed to update preferences");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Job Preferences</h1>
                <p className="text-gray-500 mt-2">
                    These preferences are used to automatically calculate the priority of your job applications.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Preferred Companies <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="preferredCompanies"
                        value={preferences.preferredCompanies.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'preferredCompanies')}
                        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g. Google, Microsoft, Amazon"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Preferred Locations <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="preferredLocations"
                        value={preferences.preferredLocations.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'preferredLocations')}
                        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g. New York, Remote, London"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Expected Minimum Salary ($/yr)
                    </label>
                    <input
                        type="number"
                        name="expectedMinimumSalary"
                        value={preferences.expectedMinimumSalary}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g. 100000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Preferred Work Types <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="preferredWorkTypes"
                        value={preferences.preferredWorkTypes.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'preferredWorkTypes')}
                        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g. REMOTE, HYBRID, ONSITE"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Preferred Employment Types <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="preferredEmploymentTypes"
                        value={preferences.preferredEmploymentTypes.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'preferredEmploymentTypes')}
                        className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g. FULL_TIME, CONTRACT"
                    />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition shadow-sm w-full md:w-auto"
                    >
                        Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserPreferences;
