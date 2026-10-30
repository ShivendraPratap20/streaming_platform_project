import axios, { AxiosError} from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const BASE_URL:string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
    (res:AxiosResponse) => {
        return res.data.data;
    },
    (err: AxiosError) => {
        console.log(`Axios Error while making request ${err}`);
        return err;
    }
);

export default api;