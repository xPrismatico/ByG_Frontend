import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";

export const AuthServices = {
    async login(values: {email: string, password: string}) {
        try {
            const response = await ApiBackend.post<ResponseAPI>(
                "/auth/login", 
                values,
                {headers: {"Content-Type": "application/json"}}
            );
            return response;

        }catch (error: any) {
            const backendError = error.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0){
                throw backendError.errors.join( " | ");
            }
             throw backendError?.message || "Error al iniciar sesión.";
        }
    },

    async register (values: any) {
        try {
            const response = await ApiBackend.post<ResponseAPI>(
                "/auth/register",
                values,
                {headers: {"Content-Type": "application/json"}}
            );
            return response;
        }catch (error: any) {
            const backendError = error.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0){
                throw backendError.errors.join( " | ");
            }
            throw backendError?.message || "Error al registrar usuario.";
        }

    },
};