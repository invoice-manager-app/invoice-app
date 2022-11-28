import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPagination } from "../store/pagination-slice";
import PaginationComponent from "./UI/Pagination";
import { getInvoiceListActions } from "../store/get-invoice-slice";
import { searchData } from "../store/search-slice";

const InvoiceBar = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState();
  const [itemsPerPage] = useState(10);

  const data = useSelector((state) => state.invoiceListReducer.data);
  const dispatch = useDispatch();

  //invoice data
  const invoices = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );
  //count of first render invoice
  const InvoiceListcount = useSelector(
    (state) => state.invoiceListReducer.count
  ); //count of first render invoice
  const SearchListcount = useSelector((state) => state.searchReducer.count);

  //search results
  const searchResults = useSelector((state) => state.searchReducer.searchData);

  // pagination list
  const nextPageList = useSelector((state) => state.paginationReducer.pageData);
  //next button
  const nextBtn = useSelector((state) => state.invoiceListReducer.next);

  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      num: currentPage,
      token,
    };
    dispatch(getPagination(obj));
    //  setData(invoices);
    dispatch(getInvoiceListActions.addInvoices(invoices));
  }, [currentPage, dispatch, invoices]);

  //pagination next page
  useEffect(() => {
    if (nextBtn !== null) {
      dispatch(getInvoiceListActions.addInvoices(nextPageList));
      setCount(InvoiceListcount);
    }
  }, [nextPageList, nextBtn, dispatch, InvoiceListcount]);

  //search data

  useEffect(() => {
    if (searchResults && searchResults.length !== 0) {
      dispatch(getInvoiceListActions.addInvoices(searchResults));
      setCount(SearchListcount);
    }
    if (search !== "" && searchResults && searchResults.length === 0) {
      dispatch(getInvoiceListActions.addInvoices(searchResults));
      setCount(SearchListcount);
    }
    if (search.trim("") === "") {
      dispatch(getInvoiceListActions.addInvoices(invoices));
      setCount(InvoiceListcount);
    }
  }, [
    dispatch,
    search,
    invoices,
    searchResults,
    SearchListcount,
    InvoiceListcount,
  ]);
  if (search !== "" && searchResults && searchResults.length === 0) {
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
      <div className={classes.invoiceList}>
        {data &&
          data.map((item) => (
            <InvoiceItem
              key={item.invoice_code}
              id={item.invoice_code}
              name={item.client_name}
              items={item.items}
              date={item.created_at}
              status={item.status}
              net_amount={item.get_net_amount}
            />
          ))}
      </div>

      {data && data.length !== 0 && nextBtn !== null && (
        <PaginationComponent
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          count={count}
        />
      )}
    </Fragment>
  );
};
export default memo(InvoiceBar);
