import { motion } from "motion/react";

const Pulse = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-gray-100 rounded-lg ${className}`}
  />
);

export const SkeletonForm = () => (
  <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 h-full space-y-6">
    <div className="flex items-center gap-2 mb-4">
      <Pulse className="w-6 h-6 rounded-full" />
      <Pulse className="w-32 h-6" />
    </div>
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Pulse className="w-16 h-3" />
          <Pulse className="w-full h-12 rounded-xl" />
        </div>
      ))}
      <Pulse className="w-full h-14 rounded-xl mt-4" />
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100 h-full min-h-100 flex flex-col">
    <div className="flex items-center gap-2 mb-8">
      <Pulse className="w-6 h-6 rounded-full" />
      <Pulse className="w-40 h-6" />
    </div>
    <div className="flex-1 flex items-center justify-center py-8">
      <Pulse className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
    </div>
    <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Pulse className="w-12 h-2" />
          <Pulse className="w-20 h-6" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonListItem = () => (
  <div className="bg-white p-4 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Pulse className="w-3 h-3 rounded-full" />
      <div className="space-y-2">
        <Pulse className="w-24 h-4" />
        <Pulse className="w-32 h-3" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <Pulse className="w-20 h-6" />
      <div className="flex gap-1">
        <Pulse className="w-8 h-8 rounded-lg" />
        <Pulse className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  </div>
);
