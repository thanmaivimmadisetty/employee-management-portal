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
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Top Accent */}
      <div className="h-1 bg-[#0F8B8D]"></div>

      <div className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">
              {title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0B2E59]">
              {value}
            </h2>

          </div>

          {Icon && (
            <div className="w-14 h-14 rounded-xl bg-[#0F8B8D] flex items-center justify-center shadow-md">

              <Icon className="w-7 h-7 text-white" />

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
                    : "bg-teal-100 text-teal-700"
                }`}
              >
                {trend}
              </span>

            )}

            {description && (

              <span className="text-sm text-gray-500">

                {description}

              </span>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default StatCard;
