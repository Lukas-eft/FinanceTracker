import { useState, useMemo, type FormEvent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Plus,
  Trash2,
  Wallet,
  PieChart as PieChartIcon,
  Euro,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FinanceItem {
  id: string;
  name: string;
  amount: number;
  color: string;
}

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
];

export default function FinanceVisualizer() {
  const [items, setItems] = useState<FinanceItem[]>([
    { id: "1", name: "Miete", amount: 800, color: COLORS[0] },
    { id: "2", name: "Lebensmittel", amount: 300, color: COLORS[1] },
    { id: "3", name: "Freizeit", amount: 150, color: COLORS[2] },
  ]);

  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.amount, 0),
    [items],
  );

  const addItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newItem: FinanceItem = {
      id: crypto.randomUUID(),
      name: newName,
      amount: amount,
      color: COLORS[items.length % COLORS.length],
    };

    setItems([...items, newItem]);
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
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-3">
              <Wallet className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              Finanz Visualisierer
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">
              Verwalten und visualisieren Sie Ihre Ausgaben intuitiv.
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
                  Gesamtbetrag
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
          {/* Top Section: Input & Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-4">
              <section className="bg-white p-5 md:p-6 rounded-3xl md:rounded-3xl shadow-sm border border-gray-100 h-full">
                <h2 className="text-base md:text-lg font-medium mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gray-400" />
                  Neuer Eintrag
                </h2>
                <form onSubmit={addItem} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="z.B. Miete, Auto..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="amount"
                      className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      Betrag (€)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm md:text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newName || !newAmount}
                    className="w-full py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] text-sm md:text-base"
                  >
                    Hinzufügen
                  </button>
                </form>
              </section>
            </div>

            {/* Visualization (Pie Chart) */}
            <div className="lg:col-span-8">
              <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100 h-full min-h-100 flex flex-col">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                    Verteilung
                  </h2>
                </div>

                <div className="flex-1 w-full min-h-62.5 md:min-h-75">
                  {items.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={items}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="amount"
                          animationBegin={0}
                          animationDuration={1000}
                        >
                          {items.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) =>
                            typeof value === "number"
                              ? value.toLocaleString("de-DE", {
                                  style: "currency",
                                  currency: "EUR",
                                })
                              : value
                          }
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            padding: "12px 16px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                      <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-100 flex items-center justify-center">
                        <PieChartIcon className="w-10 h-10" />
                      </div>
                      <p className="text-sm">
                        Fügen Sie Daten hinzu, um das Diagramm zu sehen.
                      </p>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Einträge
                      </p>
                      <p className="text-lg md:text-xl font-semibold">
                        {items.length}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Größter Posten
                      </p>
                      <p className="text-lg md:text-xl font-semibold">
                        {Math.max(...items.map((i) => i.amount)).toLocaleString(
                          "de-DE",
                          { style: "currency", currency: "EUR" },
                        )}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Durchschnitt
                      </p>
                      <p className="text-lg md:text-xl font-semibold">
                        {(total / items.length).toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Bottom Section: Items List */}
          <div className="w-full">
            <section className="bg-white rounded-3xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-base md:text-lg font-medium">
                  Auflistung der Einträge
                </h2>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                  {items.length} Positionen
                </span>
              </div>
              <div className="max-h-150 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <p className="text-gray-400">
                        Noch keine Einträge vorhanden.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-50">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-3 h-3 rounded-full shadow-sm"
                              style={{ backgroundColor: item.color }}
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {((item.amount / total) * 100).toFixed(1)}% vom
                                Gesamt
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-gray-900">
                              {item.amount.toLocaleString("de-DE", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
