import axios, { AxiosError} from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const BASE_URL:string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
    (res:AxiosResponse) => {
        console.log(res.data)
        return res.data.data;
    },
    (err: AxiosError) => {
        console.log(`Axios Error while making request`, err.response);
        return Promise.reject(err.response?.data);
    }
);

export default api;