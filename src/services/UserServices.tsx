import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { UserDto, UserFilters } from "@/interfaces/Users";

// ELIMINA O COMENTA ESTA LÍNEA, NO LA NECESITAS SI USAS LA BASEURL DE AXIOS
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280/api/User';

export const UserServices = {
    // GET: /api/User
    async fetchUsers(filters?: UserFilters): Promise<UserDto[]> {
        //Usamos la ruta relativa. Axios la pegará a la baseURL (localhost:5280)
        const response = await ApiBackend.get<ResponseAPI<UserDto[]>>('/api/User', {
            params: filters,
        });
        
        return response.data.data;
    },

    // GET: /api/User/search
    async searchUser(email?: string, name?: string): Promise<UserDto> {
        const response = await ApiBackend.get<ResponseAPI<UserDto>>('/api/User/search', {
            params: { email, name }
        });
        return response.data.data;
    },

    // PATCH: /api/User/status
    async toggleStatus(email: string, status: boolean): Promise<string> {
        const response = await ApiBackend.patch<ResponseAPI<string>>('/api/User/status', {
            email,
            status
        });
        return response.data.message;
    },

    // PUT: /api/User/profile
    async updateProfile(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }): Promise<UserDto> {
        const response = await ApiBackend.put<ResponseAPI<UserDto>>('/api/User/profile', data);

        if (!response.data.success) {
            throw new Error(response.data.message || "Error al actualizar el perfil.");
        }

        return response.data.data;
    },

    // PATCH: /api/User/changeRole
    async changeRole(email: string, newRole: string): Promise<string> {
        const response = await ApiBackend.patch<ResponseAPI<string>>('/api/User/changeRole', {
            email,
            newRole
        });
        return response.data.message;
    }
};