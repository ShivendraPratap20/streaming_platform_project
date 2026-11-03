import { useQuery } from "@tanstack/react-query";
import { type UseQueryResult } from "@tanstack/react-query";
import api from "../api/axios";



function useAuth(){
    const { isLoading, data }:UseQueryResult = useQuery({
        queryKey: ["me"],
        queryFn: async () =>{
            const data = await api.get("/user/auth/self");
            return data
        }
    });
    return { isLoading, data, isAuthenticated: !!data };
};

export default useAuth