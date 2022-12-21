import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { filterInvoice, invoicePagination } from "../../store/filter-slice";
import classes from "./FilterInvoice.module.css";
const FilterInvoices = ({
  selectInput,
  setSelectInput,
  currentPage,
  search,
  setCount,
}) => {
  const dispatch = useDispatch();

  //filtered-data with search
  const searchFilteredData = useSelector((state) => state.searchFilter.data);
  // search result count
  //search results
  const searchResultswithFilter = useSelector(
    (state) => state.searchFilter.data
  );
  const resultsCount = searchResultswithFilter && searchResultswithFilter.count;
  console.log(resultsCount);
  console.log(searchResultswithFilter);

  useEffect(() => {
    if (
      search !== "" &&
      selectInput !== "" &&
      searchResultswithFilter &&
      searchResultswithFilter.count
    ) {
      setCount(searchResultswithFilter.count);
      // console.log(resultsCount);
    }
  }, [resultsCount, search, searchResultswithFilter, selectInput, setCount]);

  //invoice data
  const response = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );
  const results = response && response.results;

  // filter invoices first page

  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      token,
      filter: selectInput,
      number: currentPage,
    };
    if (
      selectInput !== "" &&
      search.trim() === "" &&
      currentPage === 1 &&
      results &&
      results.length > 1
    ) {
      console.log("true");
      dispatch(filterInvoice(obj));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dispatch, search, selectInput]);

  // filter invoices with pagination
  useEffect(() => {
    let token = localStorage.getItem("token");

    const obj = {
      token,
      filter: selectInput,
      number: currentPage,
    };
    if (results === null) return;

    if (
      selectInput !== "" &&
      search === "" &&
      currentPage > 1 &&
      results.length > 1
    ) {
      dispatch(invoicePagination(obj));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dispatch, search, selectInput]);

  //filter Data with search
  const filterSearchCount = searchFilteredData && searchFilteredData.count;

  useEffect(() => {
    if (search.trim() !== "" && currentPage === 1) {
      setCount(filterSearchCount);
    }
  }, [filterSearchCount, search, setCount, currentPage]);

  const selectHandeler = (e) => {
    setSelectInput(e.target.value);
    localStorage.setItem("filter", e.target.value);
  };

  return (
    <div className={classes.filter}>
      <label htmlFor="filter">filter by</label>
      <select
        id="filter"
        onChange={selectHandeler}
        value={selectInput}
        disabled={results && results.length > 1 ? false : true}
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
