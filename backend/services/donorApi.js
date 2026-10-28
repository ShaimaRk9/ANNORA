import axios from "axios";

const donorApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use your existing authentication convention.
// This example assumes the application stores a JWT here.
donorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getDonorDashboard = () =>
  donorApi.get("/donor/dashboard");

export const createDonation = (payload) =>
  donorApi.post("/donations", payload);

export const getMyDonations = (params = {}) =>
  donorApi.get("/donations/mine", { params });

export const getDonation = (id) =>
  donorApi.get(`/donations/${id}`);

export const getDonationRequests = (id) =>
  donorApi.get(`/donations/${id}/matches`);

export const getPickupTracking = (params = {}) =>
  donorApi.get("/pickups/mine", { params });

export const getDonationHistory = (params = {}) =>
  donorApi.get("/donor/history", { params });

export const getBusinessProfile = () =>
  donorApi.get("/donor/business-profile");

export const updateBusinessProfile = (payload) =>
  donorApi.patch("/donor/business-profile", payload);

export const getVerificationDetails = () =>
  donorApi.get("/donor/verification");

export const updateDonorSettings = (payload) =>
  donorApi.patch("/donor/settings", payload);

export default donorApi;