// src/services/AuthServices.ts
import { ApiBackend } from "@/clients/Axios";
import { AuthenticatedUser } from "@/interfaces/Auth";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { AuthenticatedUserDto, NewUserDto, LoginDto } from "@/interfaces/Users";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthServices = {
    async login(data: LoginDto) {
        try {
            // CORREGIDO: Usar ruta relativa con /api
            const response = await ApiBackend.post<ResponseAPI<AuthenticatedUser>>(
                '/api/Auth/login', 
                data
            );
            return response.data;
        } catch (error: any) {
            console.error("URL intentada:", '/api/Auth/login');
            throw error.response?.data?.message || "Servidor no encontrado";
        }
    },

    async register(values: any) {
        try {
            // El backend retorna NewUserDto tras el registro
            const response = await ApiBackend.post<ResponseAPI<NewUserDto>>(
                '/api/Auth/register',
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