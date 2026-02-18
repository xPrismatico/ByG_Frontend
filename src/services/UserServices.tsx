import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { UserDto, UserFilters } from "@/interfaces/Users";

export const UserServices = {
    // GET: /api/User
    async fetchUsers(filters?: UserFilters): Promise<UserDto[]> {
        // En Axios, puedes pasar el objeto filters directamente a params
        // Axios se encarga de serializarlo como QueryString automáticamente
        const response = await ApiBackend.get<ResponseAPI<UserDto[]>>("/api/User", {
            params: filters,
        });
        
        // Retornamos la data directamente (Array de UserDto)
        return response.data.data;
    },

    // GET: /api/User/search
    async searchUser(email?: string, name?: string): Promise<UserDto> {
        const response = await ApiBackend.get<ResponseAPI<UserDto>>("/api/User/search", {
            params: { email, name }
        });
        return response.data.data;
    },

    // PATCH: /api/User/status
    async toggleStatus(email: string, status: boolean): Promise<string> {
        // Tu backend espera ToggleStatusDto { Email, Status }
        const response = await ApiBackend.patch<ResponseAPI<string>>("/api/User/status", {
            email,
            status
        });
        return response.data.message;
    },

    // PUT: /api/User/profile
    async updateProfile(data: {
        firstName?: string; // Corregido para que coincida con UpdateProfileDto
        lastName?: string;
        email?: string;
        phone?: string;
    }): Promise<UserDto> {
        const response = await ApiBackend.put<ResponseAPI<UserDto>>("/api/User/profile", data);

        if (!response.data.success) {
            throw new Error(response.data.message || "Error al actualizar el perfil.");
        }

        return response.data.data;
    },

    // PATCH: /api/User/changeRole
    async changeRole(email: string, newRole: string): Promise<string> {
        const response = await ApiBackend.patch<ResponseAPI<string>>("/api/User/changeRole", {
            email,
            newRole
        });
        return response.data.message;
    }
};