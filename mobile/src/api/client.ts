import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = (Constants.expoConfig?.extra as any)?.API_BASE_URL || 'http://localhost:4000';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
