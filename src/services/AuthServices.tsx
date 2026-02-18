import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { AuthenticatedUserDto, NewUserDto } from "@/interfaces/Users";

export const AuthServices = {
    async login(values: { email: string; password: string }) {
        try {
            // El backend retorna un AuthenticatedUserDto
            const response = await ApiBackend.post<ResponseAPI<AuthenticatedUserDto>>(
                "/api/Auth/login", // Ajustado a la ruta del AuthController
                values,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error: any) {
            const backendError = error.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0) {
                throw backendError.errors.join(" | ");
            }
            throw backendError?.message || "Error al iniciar sesión.";
        }
    },

    async register(values: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    }) {
        try {
            // El backend retorna un NewUserDto
            const response = await ApiBackend.post<ResponseAPI<NewUserDto>>(
                "/api/Auth/register",
                values,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error: any) {
            const backendError = error.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0) {
                throw backendError.errors.join(" | ");
            }
            throw backendError?.message || "Error al registrar usuario.";
        }
    },
};