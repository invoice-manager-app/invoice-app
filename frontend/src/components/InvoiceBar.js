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

const InvoiceBar = ({ search, filter, currentPage, setCurrentPage }) => {
  const [count, setCount] = useState(null);
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
  const filterSearchFirstPage = useSelector((state) => state.searchFilter.data);
  // filtered data next page
  //search results [pagination]
  const searchResults = useSelector(
      (state) => state.paginationSearch.searchData
    ),
    resultCount = useSelector((state) => state.paginationSearch.count),
    searchNextBtn = useSelector((state) => state.searchReducer.nextBtn);

  //Search first page
  const searchFirstPage = useSelector(
    (state) => state.searchReducer.searchData
  );

  //is Loading
  const isLoading = useSelector((state) => state.searchReducer.isLoading);

  // pagination list
  const nextPageData = useSelector((state) => state.paginationReducer.pageData);

  //next button
  const nextBtn = useSelector((state) => state.invoiceListReducer.next);
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
      if (currentPage > 1) {
        dispatch(getPagination(obj));
      }
    }

    setCount(listCount);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (invoice_list === null || listCount === null) return;

    if (search.trim() === "") return;
    let token = localStorage.getItem("token");

    const obj = {
      number: currentPage,
      name: search,
      token,
    };

    const timer = setTimeout(() => {
      if (currentPage === 1) {
        delete obj.number;

        dispatch(searchData(obj));
      } else {
        dispatch(searchPagination(obj));
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, currentPage, invoice_list]);

  useEffect(() => {
    if (search !== "") {
      setCount(resultCount);
    } else {
      setCount(listCount);
    }
  }, [search, resultCount, listCount]);
  let invoiceItems;

  // invoice List
  if (invoice_list && search === "" && filter === "") {
    invoiceItems = invoice_list.results.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }
  // search pagination
  if (search !== "" && searchResults && currentPage > 1) {
    invoiceItems = searchResults.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }
  // search result (first page)
  if (search !== "" && searchFirstPage && currentPage === 1) {
    invoiceItems = searchFirstPage.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }
  // invoice list (pages after the first)
  if (
    search === "" &&
    currentPage > 1 &&
    nextPageData &&
    nextBtn !== null &&
    filter === ""
  ) {
    console.log("true");
    invoiceItems = nextPageData.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }
  if (filter !== "" && search === "" && filteredData) {
    invoiceItems = filteredData.results.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }
  if (
    filter !== "" &&
    search !== "" &&
    filterSearchFirstPage &&
    currentPage === 1
  ) {
    invoiceItems = filterSearchFirstPage.results.map((item) => (
      <InvoiceItem
        key={item.invoice_code}
        id={item.invoice_code}
        name={item.client_name}
        items={item.items}
        date={item.created_at}
        status={item.status}
        net_amount={item.get_net_amount}
      />
    ));
  }

  // if (filter && search === "" && filteredDataNextPage && currentPage !== 1) {
  //   invoiceItems = filteredDataNextPage.results.map((item) => (
  //     <InvoiceItem
  //       key={item.invoice_code}
  //       id={item.invoice_code}
  //       name={item.client_name}
  //       items={item.items}
  //       date={item.created_at}
  //       status={item.status}
  //       net_amount={item.get_net_amount}
  //     />
  //   ));
  // }
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
      {nextBtn !== null && (
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
