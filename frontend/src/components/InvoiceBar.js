import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "./UI/Pagination";

import { getInvoicList } from "../store/get-invoice-slice";
import LoadingSpinner from "./UI/LoadingSpinner";
import { searchPagination } from "../store/search-pagination-slice";
import { searchData } from "../store/search-slice";
import { getPagination } from "../store/pagination-slice";

const InvoiceBar = ({
  search,
  filter,
  currentPage,
  setCurrentPage,
  count,
  setCount,
}) => {
  const [itemsPerPage] = useState(10);

  const dispatch = useDispatch();
  //invoice data
  const invoice_list = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );
  //filtere invoice
  const filteredData = useSelector(
    (state) => state.filteredReducer.dataFiltered
  );
  //filter search
  const { data: filterSearchFirstPage, pagination: filterSearchPag } =
    useSelector((state) => state.searchFilter);

  // filtered data next page
  //search results [pagination]
  const { searchData: searchResults, count: resultCount } = useSelector(
    (state) => state.paginationSearch
  );

  //Search first page + is Loading
  const {
    searchData: searchFirstPage,
    isLoading,
    nextBtn: searchNextBtn,
  } = useSelector((state) => state.searchReducer);

  //invoice data
  const resonse = useSelector((state) => state.invoiceListReducer.invoice_list);
  const results = resonse && resonse.results;
  // pagination list
  const nextPageData = useSelector((state) => state.paginationReducer.pageData);

  //next button
  const next = invoice_list && invoice_list.next;

  //Invoice List
  const listCount = invoice_list && invoice_list.count;

  //dispatch all invoices
  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      number: currentPage,
      token,
    };
    if (search === "") {
      dispatch(getInvoicList(token));
    }

    if (search === "" && filter === "" && currentPage > 1) {
      dispatch(getPagination(obj));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search]);

  //invoices count
  useEffect(() => {
    if (invoice_list === null || listCount === null) return;
    if (search.trim() === "") {
      setCount(listCount);
    }
    if (search.trim() !== "") {
      setCount(resultCount);
    }
  }, [search, resultCount, listCount, invoice_list, setCount]);

  let invoiceItems;

  const items = (item) => {
    return (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    );
  };

  // invoice List
  if (invoice_list && search === "" && filter === "") {
    invoiceItems = invoice_list.results.map((item) => items(item));
  } // invoice list (pages after the first)
  if (
    search === "" &&
    currentPage > 1 &&
    nextPageData &&
    next &&
    next !== null &&
    filter === ""
  ) {
    invoiceItems = nextPageData.map((item) => items(item));
  }
  // search pagination
  if (search !== "" && searchResults && currentPage > 1) {
    invoiceItems = searchResults.map((item) => items(item));
  }
  // search result (first page)
  if (search !== "" && searchFirstPage && currentPage === 1) {
    invoiceItems = searchFirstPage.map((item) => items(item));
  }

  if (filter !== "" && search === "" && filteredData) {
    invoiceItems = filteredData.results.map((item) => items(item));
  }
  if (
    filter !== "" &&
    search !== "" &&
    filterSearchFirstPage &&
    currentPage === 1
  ) {
    invoiceItems = filterSearchFirstPage.results.map((item) => items(item));
  }
  //filter -- search -- pagination
  if (filter !== "" && search !== "" && filterSearchPag && currentPage > 1) {
    invoiceItems = filterSearchPag.results.map((item) => items(item));
  }

  //validation
  if (searchResults && searchResults.length === 0 && isLoading === false) {
    return <p className="not-found"> Not Found</p>;
  }
  if (invoice_list === null || listCount === null) return;
  return (
    <Fragment>
      <ul className={classes.categories}>
        <li>ORDER ID</li>
        <li>CREATED</li>
        <li>CUSTOMER</li>
        <li>TOTAL</li>
        <li>STATUS</li>
      </ul>
      <div className={classes.invoiceList}>{invoiceItems}</div>
      {isLoading && <LoadingSpinner />}
      {next && next !== null && (
        <PaginationComponent
          count={count}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          search={search}
          searchNext={searchNextBtn}
          filter={filter}
        />
      )}
    </Fragment>
  );
};
export default memo(InvoiceBar);
