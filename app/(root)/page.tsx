"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Edit } from "lucide-react";
import { TableForm } from "@/components/tables/table-form";

export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const fetchTables = async () => {
    try {
      const apiUrl = `${window.location.origin}/api/tables`;

      const res = await fetch(apiUrl, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu bàn:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDelete = async (tableId, tableNumber) => {
    if (
      !window.confirm(`Bạn có chắc chắn muốn xóa Bàn số ${tableNumber} không?`)
    ) {
      return;
    }

    const originalTables = tables;
    setTables(tables.filter((t) => t.id !== tableId));

    try {
      const deleteUrl = `${window.location.origin}/api/tables/${tableId}`;

      const res = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!res.ok) {
        setTables(originalTables);
        throw new Error("Xóa không thành công.");
      }

      console.log(`Bàn số ${tableNumber} đã bị xóa.`);
    } catch (err) {
      console.error("Lỗi khi xóa bàn:", err);
      alert("Xóa thất bại. Vui lòng thử lại.");
      setTables(originalTables);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingTable(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTable(null);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Quản lý Bàn Nhà Hàng ({tables.length})
        </h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm Bàn Mới
        </Button>
      </div>

      {/* Table List */}
      <div className="border rounded-lg shadow-md p-4 bg-white mb-6">
        <ul className="space-y-3">
          {tables.length === 0 ? (
            <li className="text-gray-500 italic">
              Không có bàn nào đang hoạt động.
            </li>
          ) : (
            tables.map((table) => (
              <li
                key={table.id}
                className="flex justify-between items-center border-b pb-2 last:border-b-0"
              >
                <span className="font-medium text-lg">
                  Bàn số:{" "}
                  <span className="text-blue-600">{table.tableNumber}</span>{" "}
                  (Sức chứa: {table.capacity} | Trạng thái: {table.status})
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(table)}
                  >
                    <Edit className="h-4 w-4 text-blue-500 hover:text-blue-700 transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(table.id, table.tableNumber)}
                  >
                    <X className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors" />
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showForm && (
        <div className="border rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingTable
                ? `Chỉnh sửa Bàn ${editingTable.tableNumber}`
                : "Thêm Bàn Mới"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancelForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <TableForm table={editingTable} />
        </div>
      )}
    </main>
  );
}
