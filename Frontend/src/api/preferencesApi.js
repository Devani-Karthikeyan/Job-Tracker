import axios from 'axios';

const API_URL = 'http://localhost:8080/api/preferences';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getPreferences = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePreferences = async (preferencesData) => {
    try {
        const response = await axios.put(API_URL, preferencesData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error;
    }
};
