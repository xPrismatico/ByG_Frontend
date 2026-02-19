// src/interfaces/Auth.ts
export interface AuthenticatedUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    token: string;
    role: string;
    registered: string; // DateOnly llega como string ISO
    lastAccess: string | null; 
    isActive: boolean;
}

// También te servirá para tipar el objeto que guardas en localStorage
export interface UserSession {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}