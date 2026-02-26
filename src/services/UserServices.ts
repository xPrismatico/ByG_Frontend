import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { UserDto, UserFilters } from "@/interfaces/Users";
import { PagedResponse } from "@/interfaces/PagedResponse"; // Interfaz nueva

const CONTROLLER_URL = 'api/User';

export const UserServices = {
    // GET: /api/User
    async fetchUsers(filters?: UserFilters): Promise<PagedResponse<UserDto>> {
        const response = await ApiBackend.get<ResponseAPI<PagedResponse<UserDto>>>(CONTROLLER_URL, {
            params: filters,
        });
        
        return response.data.data;
    },

    // GET: /api/User/search
    async searchUser(email?: string, name?: string): Promise<UserDto> {
        const response = await ApiBackend.get<ResponseAPI<UserDto>>(`${CONTROLLER_URL}/search`, {
            params: { email, name }
        });
        return response.data.data;
    },

    // PATCH: /api/User/status
    async toggleStatus(email: string): Promise<string> {
        const response = await ApiBackend.patch<ResponseAPI<string>>(`${CONTROLLER_URL}/status`, {
            email
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
        const response = await ApiBackend.put<ResponseAPI<UserDto>>(`${CONTROLLER_URL}/profile`, data);

        if (!response.data.success) {
            throw new Error(response.data.message || "Error al actualizar el perfil.");
        }

        return response.data.data;
    },

    // PATCH: /api/User/changeRole
    async changeRole(email: string, newRole: string): Promise<string> {
        const response = await ApiBackend.patch<ResponseAPI<string>>(`${CONTROLLER_URL}/changeRole`, {
            email,
            newRole
        });
        return response.data.message;
    }
};