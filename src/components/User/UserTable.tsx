// @/components/User/UserTable.tsx
import { ViewUserDialog } from "./ViewUserDialog";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fecha: string;
  estado: string;
  ultimoAcceso: string;
}

interface UserTableProps {
  usuarios: Usuario[];
  onToggleStatus?: (email: string, currentStatus: boolean, role: string) => Promise<void>;
}

export function UserTable({ usuarios, onToggleStatus }: UserTableProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Nombre</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Rol</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {usuarios.map((user) => {
            const esAdmin = user.rol?.toLowerCase().includes("admin");
            const isActivo = user.estado === "Activo";

            return (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* Celda Nombre */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.nombre}
                </td>

                {/* Celda Email */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>

                {/* Celda Rol */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="capitalize">{user.rol}</span>
                </td>

                {/* Celda Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                  <ViewUserDialog usuario={user} onToggleStatus={onToggleStatus} />
                  
                  {!esAdmin && (
                    <button
                      onClick={() => onToggleStatus?.(user.email, isActivo, user.rol)}
                      className={`font-semibold ${
                        isActivo ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"
                      }`}
                    >
                      {isActivo ? "Desactivar" : "Activar"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}