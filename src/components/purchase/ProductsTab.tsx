import type { PurchaseItem } from "@/interfaces/purchase"

export default function ProductsTab({ items }: { items: PurchaseItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#F2F2F2] text-center text-[#2F2F2F]">
        <p>No hay productos registrados en esta compra.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm">
          <thead className="border-b border-[#F2F2F2] bg-[#F2F2F2]/50 text-[#2F2F2F]">
            <tr>
              <th className="p-4 text-left font-semibold">Producto / Descripción</th>
              <th className="p-4 text-left font-semibold">Marca/Modelo</th>
              <th className="p-4 text-left font-semibold">Talla/Medida</th>
              <th className="p-4 text-center font-semibold">Unidad</th>
              <th className="p-4 text-right font-semibold">Cantidad solicitada</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F2F2F2] last:border-0 hover:bg-[#F2F2F2]/40 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-[#1C1C1C]">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-[#2F2F2F] mt-0.5 line-clamp-2">{item.description}</p>
                  )}
                </td>
                <td className="p-4 text-[#2F2F2F]">{item.brandModel || "-"}</td>
                <td className="p-4 text-[#2F2F2F]">{item.size || "-"}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex bg-[#F2F2F2] px-2 py-1 rounded text-xs font-medium text-[#2F2F2F]">
                    {item.unit}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-[#1C1C1C] text-base">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}