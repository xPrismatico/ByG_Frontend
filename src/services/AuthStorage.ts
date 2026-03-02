import type { AuthenticatedUserDto, UserSession } from "@/interfaces/Auth"

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"

export const AuthStorage = {
  saveSession(user: AuthenticatedUserDto) {
    localStorage.setItem(TOKEN_KEY, user.token);
    // Guardamos nombre y apellido por separado o los concatenamos aquí
    localStorage.setItem(USER_KEY, JSON.stringify({ 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName,
      role: user.role
    }));
  },

  getUser(): UserSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },


  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  },
}