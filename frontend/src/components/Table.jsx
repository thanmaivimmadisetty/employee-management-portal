import React from "react";

const Table = ({ children }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          {children}

        </table>

      </div>

    </div>
  );
};

export default Table;
