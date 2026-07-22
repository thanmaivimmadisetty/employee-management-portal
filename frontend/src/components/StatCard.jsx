import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = "neutral",
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-cyan-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-600"></div>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

        </div>

        {Icon && (
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-100 text-cyan-700">
            <Icon size={28} />
          </div>
        )}

      </div>

      {(description || trend) && (
        <div className="mt-5 flex items-center gap-3">

          {trend && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                trendType === "positive"
                  ? "bg-green-100 text-green-700"
                  : trendType === "negative"
                  ? "bg-red-100 text-red-700"
                  : "bg-cyan-100 text-cyan-700"
              }`}
            >
              {trend}
            </span>
          )}

          {description && (
            <span className="text-sm text-slate-500">
              {description}
            </span>
          )}

        </div>
      )}

    </div>
  );
};

export default StatCard;
