// src/interfaces/Auth.ts
export interface AuthenticatedUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    token: string;
    isActive: boolean;
    role: string; // <--- AGREGA ESTA LÍNEA
    registered: string;
    lastAccess: string | null;
}

// También te servirá para tipar el objeto que guardas en localStorage
export interface UserSession {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}