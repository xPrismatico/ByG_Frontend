// src/interfaces/Users.ts

export interface UserDto {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    registered: string;
    lastAccess: string | null;
}

export interface AuthenticatedUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    token: string;
    isActive: boolean;
    registered: string;
    lastAccess: string | null;
}

export interface NewUserDto {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserFilters {
    isActive?: boolean;
    searchTerm?: string;
    registeredFrom?: string; // Formato YYYY-MM-DD
    registeredTo?: string;   // Formato YYYY-MM-DD
    orderBy?: string;
    pageNumber?: number;
    pageSize?: number;
}



export interface LoginDto {
    email: string;
    password: string;
}