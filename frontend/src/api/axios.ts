import axios, { AxiosError} from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL:string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    withCredentials: true,
});

api.interceptors.response.use(
    (res:AxiosResponse) => {
        return res.data.data;
    },
    (error: AxiosError) => {
        console.log(`Axios Error while making request`, error);

        if(axios.isCancel(error))
            return Promise.reject("UPLOAD_CANCELLED")
        
        if (!error.response) {
                return Promise.reject("NETWORK_ERROR");
        }

        return Promise.reject(error.response?.data || error);
    }
);

const addToFavorite = async (mediaID: string) => {
    const response = await api.put(`/user/addFavorite/${mediaID}`);
    return response;
};

export default api;

export { 
    addToFavorite,
}