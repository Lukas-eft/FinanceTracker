import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { FinanceItem } from "../types";

interface FinanceChartProps {
  items: FinanceItem[];
  total: number;
}

export const FinanceChart: React.FC<FinanceChartProps> = ({ items, total }) => {
  return (
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-100 flex items-center justify-center">
              <PieChartIcon className="w-10 h-10" />
            </div>
            <p className="text-sm">Add Data To Show Diagram.</p>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Einträge
            </p>
            <p className="text-lg md:text-xl font-semibold">{items.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Größter Posten
            </p>
            <p className="text-lg md:text-xl font-semibold">
              {Math.max(...items.map((i) => i.amount)).toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Average
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
  );
};
