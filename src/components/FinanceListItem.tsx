import { useState, type FC } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, useMotionValue, animate } from "motion/react";
import type { FinanceItem } from "../types";

interface FinanceListItemProps {
  item: FinanceItem;
  total: number;
  onRemove: (id: string) => void;
  onEdit: (item: FinanceItem) => void;
  isEditing: boolean;
}

export const FinanceListItem: FC<FinanceListItemProps> = ({
  item,
  total,
  onRemove,
  onEdit,
  isEditing,
}) => {
  const [dragLock, setDragLock] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);

  return (
    <div className="relative overflow-hidden group rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-emerald-50 flex items-center justify-start px-8">
          <Pencil
            className={`w-6 h-6 transition-transform duration-200 ${dragLock === "right" ? "scale-110 text-emerald-600" : "scale-90 text-emerald-300"}`}
          />
        </div>
        <div className="w-1/2 bg-red-50 flex items-center justify-end px-8">
          <Trash2
            className={`w-6 h-6 transition-transform duration-200 ${dragLock === "left" ? "scale-110 text-red-600" : "scale-90 text-red-300"}`}
          />
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x }}
        onDrag={(_, info) => {
          if (!dragLock) {
            if (info.offset.x > 10) setDragLock("right");
            else if (info.offset.x < -10) setDragLock("left");
          }
        }}
        onDragEnd={() => {
          const visualX = x.get();
          setDragLock(null);

          animate(x, 0, { type: "spring", stiffness: 600, damping: 30 });

          if (visualX < -50) {
            onRemove(item.id);
          } else if (visualX > 50) {
            onEdit(item);
          }
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
        whileTap={{ cursor: "grabbing" }}
        className="relative z-10 p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing rounded-2xl md:rounded-3xl"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: item.color }}
          />
          <div className={isEditing ? "text-emerald-600" : ""}>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-400">
              {((item.amount / total) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-semibold text-gray-900">
            {item.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className={`p-2 rounded-lg transition-all md:opacity-40 md:hover:opacity-100 hidden md:block ${
                isEditing
                  ? "text-emerald-600 bg-emerald-50 opacity-100"
                  : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-40 md:hover:opacity-100 hidden md:block"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
