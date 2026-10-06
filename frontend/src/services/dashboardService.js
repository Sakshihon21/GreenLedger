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
