import { memo, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import classes from "./FilterInvoice.module.css";
import Search from "antd/es/transfer/search";
const FilterInvoices = ({
  currentPage,
  selectInput,
  setSelectInput,
  invoiceDispatch,
  search,
}) => {
  let token = localStorage.getItem("token");

  const selectHandeler = (e) => {
    setSelectInput(e.target.value);
    localStorage.setItem("filter", e.target.value);
  };
  let baseUrl;

  if (currentPage === 1 && setSelectInput !== "" && search.trim() === "") {
    baseUrl = `http://localhost:8000/invoice/list/?ordering=${selectInput}`;
  } else if (currentPage > 1 && setSelectInput !== "" && search.trim() === "") {
    baseUrl = `http://localhost:8000/invoice/list/?ordering=${selectInput}&page=${currentPage}`;
  } else if (
    currentPage === 1 &&
    setSelectInput !== "" &&
    search.trim() !== ""
  ) {
    baseUrl = `http://localhost:8000/invoice/list/?search=${search}&ordering=${selectInput}`;
  } else if (
    currentPage >= 1 &&
    setSelectInput !== "" &&
    search.trim() !== ""
  ) {
    baseUrl = `http://localhost:8000/invoice/list/?ordering=${selectInput}&page=${currentPage}&search=${search}`;
  } else {
  }

  //filter respose
  const { isFetching: isFiltering, refetch: reFilter } = useQuery(
    "filter/date",
    async () => {
      if (selectInput === "") return;

      try {
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        invoiceDispatch({
          state: "FILTER",
          data: data.results,
          count: data.count,
        });
      } catch (error) {}
    },
    { refetchOnWindowFocus: false }
  );

  // filter invoices
  useEffect(() => {
    if (selectInput !== "") {
      if (search.trim() === "") {
        reFilter();
      }
    }

    if (selectInput !== "" && search.trim() !== "") {
      if (currentPage === 1) {
        const timer = setTimeout(() => {
          reFilter();
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        reFilter();
      }
    }
  }, [selectInput, reFilter, currentPage, search]);

  // useEffect(() => {
  //   if (selectInput !== "" && search.trim() !== "" && currentPage === 1) {
  //     reFilter();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, reFilter, selectInput]);

  return (
    <div className={classes.filter}>
      <label htmlFor="filter">filter by</label>
      <select
        id="filter"
        onChange={selectHandeler}
        value={selectInput}
        // disabled={results && results.length > 1 ? false : true}
      >
        <option value="" disabled>
          --choose--
        </option>
        <option value="-created_at">Newest</option>
        <option value="created_at">oldest</option>
      </select>
    </div>
  );
};

export default memo(FilterInvoices);
