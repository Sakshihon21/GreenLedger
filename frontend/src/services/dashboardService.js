import api from './api';

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getDevices = async () => {
  const response = await api.get('/devices');
  return response.data;
};

export const createDevice = async (deviceData) => {
  const response = await api.post('/devices', deviceData);
  return response.data;
};

export const getSensorReadings = async (limit = 50) => {
  const response = await api.get(`/sensors/readings?limit=${limit}`);
  return response.data;
};

export const postSensorReading = async (readingData) => {
  const response = await api.post('/sensors/readings', readingData);
  return response.data;
};

export const getMarketplaceListings = async () => {
  const response = await api.get('/marketplace/listings');
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/marketplace/list', listingData);
  return response.data;
};

export const buyCredits = async (listingId) => {
  const response = await api.post(`/marketplace/buy/${listingId}`);
  return response.data;
};

export const requestCredits = async (requestData) => {
  const response = await api.post('/credits/request', requestData);
  return response.data;
};

export const getCredits = async () => {
  const response = await api.get('/credits');
  return response.data;
};

export const retireCredit = async (creditId) => {
  const response = await api.post(`/credits/${creditId}/retire`);
  return response.data;
};

export const getReductionSummary = async () => {
  const response = await api.get('/reduction/summary');
  return response.data;
};

export const getReportsSummary = async () => {
  const response = await api.get('/reports/summary');
  return response.data;
};
