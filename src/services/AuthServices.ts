// src/services/AuthServices.ts
import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { AuthenticatedUserDto, NewUserDto, LoginDto } from "@/interfaces/Users";

const CONTROLLER_URL = "api/Auth";

export const AuthServices = {
    async login(data: LoginDto) {
        try {
            // Asegúrate de que no haya una doble barra // entre API_URL y Auth
            const response = await ApiBackend.post<ResponseAPI<AuthenticatedUserDto>>(
                `${CONTROLLER_URL}/login`, 
                data
            );
            return response.data;
        } catch (error: any) {
            // Si el error es 404, imprimimos la URL exacta que falló
            console.error("URL intentada:", `${CONTROLLER_URL}/login`);
            throw error.response?.data?.message || "Servidor no encontrado";
        }
    },

    async register(values: any) {
        try {
            // El backend retorna NewUserDto tras el registro
            const response = await ApiBackend.post<ResponseAPI<NewUserDto>>(
                `${CONTROLLER_URL}/register`,
                values,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error: any) {
            const backendError = error.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors)) {
                throw backendError.errors.join(" | ");
            }
            throw backendError?.message || "Error al registrar usuario.";
        }
    }
};