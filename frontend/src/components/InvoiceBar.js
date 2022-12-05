import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "./UI/Pagination";

import { getInvoicList } from "../store/get-invoice-slice";
import LoadingSpinner from "./UI/LoadingSpinner";
import { searchAction } from "../store/search-slice";

const InvoiceBar = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState();
  const [itemsPerPage] = useState(10);

  const dispatch = useDispatch();
  //invoice data
  const invoices = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  //is Loading
  const isLoading = useSelector((state) => state.searchReducer.isLoading);

  // //count of first render invoice
  const InvoiceListcount = useSelector(
    (state) => state.invoiceListReducer.count
  );

  //search results
  const searchResults = useSelector((state) => state.searchReducer.searchData),
    resultCount = useSelector((state) => state.searchReducer.count);
  //console.log("search", searchResults);

  // pagination list
  console.log(searchResults);
  const nextPageData = useSelector((state) => state.paginationReducer.pageData);

  //next button
  const nextBtn = useSelector((state) => state.invoiceListReducer.next);

  //Invoice List
  useEffect(() => {
    if (currentPage === 1 && search.trim() === "") {
      let token = localStorage.getItem("token");
      dispatch(getInvoicList(token));
      setCount(InvoiceListcount);
    } else if (currentPage > 1 && currentPage !== 1) {
      setCount(InvoiceListcount);
    } else if (search.trim() !== "") {
      setCount(resultCount);
    } else {
      return;
    }
  }, [dispatch, currentPage, search, resultCount, InvoiceListcount]);

  let invoiceItems;

  if (invoices && search === "") {
    invoiceItems = invoices.map((item) => (
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

  if (searchResults && search !== "") {
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
  if (currentPage > 1 && currentPage !== 1 && nextPageData) {
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

  if (searchResults && searchResults.length === 0 && isLoading === false) {
    return <p className="not-found"> Not Found</p>;
  }
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
        />
      )}
    </Fragment>
  );
};
export default memo(InvoiceBar);
