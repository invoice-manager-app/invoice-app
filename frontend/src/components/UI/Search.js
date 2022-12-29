import { useQuery } from "react-query";
import Inputs from "./Inputs";

import classes from "./Search.module.css";
import { useEffect, useRef, useState } from "react";

const Search = ({
  search,
  setSearch,
  currentPage,
  invoiceDispatch,
  setCurrentPage,
  filter,
}) => {
  let token = localStorage.getItem("token");
  //invoice data

  // search invoice

  const searchHandler = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  // search response
  //invoice data
  const searchAPI = useRef(
    currentPage > 1
      ? `http://localhost:8000/invoice/list/?search=${search}`
      : `http://localhost:8000/invoice/list/?page=${currentPage}&search=${search}`
  );

  const { isFetching: gettingSearchData, refetch: research } = useQuery(
    "search/data",

    async () => {
      if (search.trim() === "" && filter !== "") return;

      try {
        const response = await fetch(searchAPI.current, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        invoiceDispatch({
          state: "SEARCH",
          data: data.results,
          count: data.count,
          responseMsg: null,
        });
      } catch (error) {
        invoiceDispatch({
          state: "ERROR",
          responseMsg: error.message,
        });
      }
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (search.trim() !== "" && filter === "") {
      if (currentPage === 1) {
        searchAPI.current = `http://localhost:8000/invoice/list/?search=${search}`;
        const timer = setTimeout(() => {
          research();
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        searchAPI.current = `http://localhost:8000/invoice/list/?page=${currentPage}&search=${search}`;
      }

      research();
    }
  }, [currentPage, filter, research, search, searchAPI]);

  const submitHandler = (e) => e.preventDefault();
  return (
    <form onSubmit={submitHandler}>
      <Inputs
        className={classes.search}
        type="text"
        value={search}
        onChange={searchHandler}
        placeholder="Search (Client Name - Invoice Code - Client Email - Status - Company Name)"
      />
    </form>
  );
};

export default Search;
