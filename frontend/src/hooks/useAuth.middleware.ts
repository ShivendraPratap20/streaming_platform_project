import api from "../api/axios";


function useAuthMiddleware() {
    const response = api.get('/auth/self');
    console.log("useAuthMiddleware response", response);
    return response;
};


export default useAuthMiddleware;