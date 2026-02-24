import axios from 'axios';

const TOKEN_KEY = "auth_token";

const ApiBackend = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
    },
    withCredentials: true,
})

ApiBackend.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// INTERCEPTOR DE RESPONSE (Detectar sesión expirada)
// Esto sirve si el token venció: saca al usuario automáticamente.
ApiBackend.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el backend dice "No autorizado", borramos sesión y redirigimos
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("auth_user");
            window.location.href = "/inicio-sesion";
        }
        return Promise.reject(error);
    }
);

export { ApiBackend };