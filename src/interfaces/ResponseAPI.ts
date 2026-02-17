// src/interfaces/ResponseAPI.ts
/**
 * Interfaz genérica para todas las respuestas del backend ByG.
 */

export interface ResponseAPI<T> {
    success: boolean;    // No opcional, el backend siempre lo manda
    message: string;    // Informativo para el usuario
    data: T;            // Aquí es donde ocurre la magia del tipado
    errors: string[] | null; // El backend manda una lista de strings o null
}