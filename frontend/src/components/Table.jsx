import React from 'react';

const Table = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md">
      <table className="w-full text-left border-collapse min-w-max">
        {children}
      </table>
    </div>
  );
};

export default Table;
