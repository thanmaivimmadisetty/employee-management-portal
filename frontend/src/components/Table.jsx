import React from "react";

const Table = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-lg">

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          {children}

        </table>

      </div>

    </div>
  );
};

export default Table;
