import React from "react";

const FilterInvoices = ({ selectInput, setSelectInput }) => {
  const selectHandeler = (e) => {
    setSelectInput(e.target.value);
  };
  return (
    <div>
      <label htmlFor="filter">filter by</label>
      <select id="filter" onChange={selectHandeler} value={selectInput}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
    </div>
  );
};

export default FilterInvoices;
