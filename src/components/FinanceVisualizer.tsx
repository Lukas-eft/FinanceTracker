import { useState, useMemo, type FormEvent } from "react";
import { Wallet, Euro, Download } from "lucide-react";
import { AnimatePresence } from "motion/react";
import type { FinanceItem } from "../types";
import { COLORS } from "../constant";
import { FinanceListItem } from "./FinanceListItem";
import { FinanceChart } from "./FinanceChart";
import { FinanceForm } from "./FinanceForm";

export default function FinanceVisualizer() {
  const [items, setItems] = useState<FinanceItem[]>([
    { id: "1", name: "Miete", amount: 800, color: COLORS[0] },
    { id: "2", name: "Lebensmittel", amount: 300, color: COLORS[1] },
    { id: "3", name: "Freizeit", amount: 150, color: COLORS[2] },
  ]);

  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.amount, 0),
    [items],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? { ...item, name: newName, amount: amount }
            : item,
        ),
      );
      setEditingId(null);
    } else {
      const newItem: FinanceItem = {
        id: crypto.randomUUID(),
        name: newName,
        amount: amount,
        color: COLORS[items.length % COLORS.length],
      };
      setItems([...items, newItem]);
    }

    setNewName("");
    setNewAmount("");
  };

  const startEdit = (item: FinanceItem) => {
    setEditingId(item.id);
    setNewName(item.name);
    setNewAmount(item.amount.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewName("");
    setNewAmount("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const exportToCSV = () => {
    if (items.length === 0) return;

    const headers = ["Name", "Betrag (EUR)"];
    const csvRows = [
      headers.join(","),
      ...items.map((item) => `"${item.name}",${item.amount.toFixed(2)}`),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `finanzen_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-3 md:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-3">
              <Wallet className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              Finanz Visualizer
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">
              Manage and visualize your expenses intuitively.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={items.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              CSV Export
            </button>
            <div className="bg-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-full">
                <Euro className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Total
                </p>
                <p className="text-xl md:text-2xl font-semibold">
                  {total.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <FinanceForm
                newName={newName}
                setNewName={setNewName}
                newAmount={newAmount}
                setNewAmount={setNewAmount}
                editingId={editingId}
                onSubmit={handleSubmit}
                onCancelEdit={cancelEdit}
              />
            </div>

            <div className="lg:col-span-8">
              <FinanceChart items={items} total={total} />
            </div>
          </div>

          <div className="w-full">
            <header className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-base md:text-lg font-medium">
                List of items
              </h2>
              <span className="text-xs text-gray-400 font-medium bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                {items.length} Positionen
              </span>
            </header>
            <div className="max-h-200 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-400">No Entries Available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <FinanceListItem
                        key={item.id}
                        item={item}
                        total={total}
                        onRemove={removeItem}
                        onEdit={startEdit}
                        isEditing={editingId === item.id}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
