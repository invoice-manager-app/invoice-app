import { useDispatch, useSelector } from "react-redux";
import Inputs from "./Inputs";

import classes from "./Search.module.css";
import { useEffect } from "react";
import { searchData } from "../../store/search-slice";
import { searchPagination } from "../../store/search-pagination-slice";
import {
  getFilteredSearch,
  getFilteredSearchPagination,
} from "../../store/filter-search-slice";
const Search = ({ search, setSearch, currentPage, filter, setCount }) => {
  const dispatch = useDispatch();
  //invoice data
  const resonse = useSelector((state) => state.invoiceListReducer.invoice_list);
  const results = resonse && resonse.results;

  //search results
  const searchResultswithFilter = useSelector(
    (state) => state.searchFilter.data
  );
  console.log(searchResultswithFilter);

  // search input UI disable when invoices length less than 2
  const disable = results && results.length > 1 ? false : true;

  // search invoice
  useEffect(() => {
    if (search.trim() === "") return;
    let token = localStorage.getItem("token");

    const obj = {
      number: currentPage,
      name: search,
      token,
    };
    const timer = setTimeout(() => {
      if (
        currentPage === 1 &&
        filter === "" &&
        search.trim() !== "" &&
        results.length > 1
      ) {
        delete obj.number;
        dispatch(searchData(obj));
      } else if (
        currentPage > 1 &&
        filter === "" &&
        search.trim() !== "" &&
        results.length > 1
      ) {
        dispatch(searchPagination(obj));
      } else {
        return;
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [dispatch, search, filter, results, currentPage]);

  //filter invoices with search and first page

  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      token,
      filter,
      number: currentPage,
    };
    if (results === null) return;

    if (
      filter !== "" &&
      search.trim() !== "" &&
      currentPage === 1 &&
      results &&
      results.length > 1
    ) {
      obj.name = search;
      delete obj.number;

      const timer = setTimeout(() => {
        dispatch(getFilteredSearch(obj));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPage, dispatch, filter, results, search]);

  //filter Data
  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      token,
      filter,
      number: currentPage,
    };
    if (results === null) return;

    //filter invoices with search and pagination

    if (filter !== "" && search.trim() !== "" && currentPage > 1) {
      const timer = setTimeout(() => {
        obj.name = search;

        dispatch(getFilteredSearchPagination(obj));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [search, dispatch, currentPage, results, filter]);

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const submitHandler = (e) => e.preventDefault();
  return (
    <form onSubmit={submitHandler}>
      <Inputs
        className={classes.search}
        type="text"
        value={search}
        disabled={disable}
        onChange={searchHandler}
        placeholder="Search (Client Name - Invoice Code - Client Email - Status - Company Name)"
      />
    </form>
  );
};

export default Search;
