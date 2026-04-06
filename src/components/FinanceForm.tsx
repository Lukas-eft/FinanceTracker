import React, { type FormEvent } from "react";
import { Plus, Pencil, X } from "lucide-react";

interface FinanceFormProps {
  newName: string;
  setNewName: (name: string) => void;
  newAmount: string;
  setNewAmount: (amount: string) => void;
  editingId: string | null;
  onSubmit: (e: FormEvent) => void;
  onCancelEdit: () => void;
}

export const FinanceForm: React.FC<FinanceFormProps> = ({
  newName,
  setNewName,
  newAmount,
  setNewAmount,
  editingId,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <section className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-base md:text-lg font-medium mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {editingId ? (
            <Pencil className="w-5 h-5 text-blue-500" />
          ) : (
            <Plus className="w-5 h-5 text-gray-400" />
          )}
          {editingId ? "Eintrag bearbeiten" : "Neuer Eintrag"}
        </div>
        {editingId && (
          <button
            onClick={onCancelEdit}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
          className={`w-full py-3 md:py-3.5 text-white rounded-xl font-medium transition-all shadow-lg active:scale-[0.98] text-sm md:text-base ${
            editingId
              ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
          } disabled:bg-gray-200 disabled:cursor-not-allowed disabled:shadow-none`}
        >
          {editingId ? "Aktualisieren" : "Hinzufügen"}
        </button>
      </form>
    </section>
  );
};
