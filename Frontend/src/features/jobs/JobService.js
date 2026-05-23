import API from "../../services/api";

export const createJob = async (userId, jobData) => {
  return await API.post(`/jobs/create/${userId}`, jobData);
};