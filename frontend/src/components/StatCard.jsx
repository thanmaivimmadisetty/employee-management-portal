import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) => {
  return (
    <div className="glass-card-interactive p-6 rounded-2xl relative overflow-hidden group">
      {/* Decorative Gradient Background Aura */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-brand-500/10 blur-2xl group-hover:bg-brand-500/20 transition-all duration-300" />
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
            {value}
          </h3>
        </div>
        
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center text-brand-400 group-hover:text-brand-300 transition-all shadow-inner">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
              trendType === 'positive' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : trendType === 'negative' 
                  ? 'bg-red-500/10 text-red-400' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 font-medium">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
