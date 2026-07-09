import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity" 
      />
      
      {/* Dialog container */}
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
