import React from "react";

const Table = ({ children }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg">

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          {children}

        </table>

      </div>

    </div>
  );
};

export default Table;
