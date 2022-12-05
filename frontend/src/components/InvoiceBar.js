import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPagination } from "../store/pagination-slice";
import PaginationComponent from "./UI/Pagination";

import {
  getInvoiceListActions,
  getInvoicList,
} from "../store/get-invoice-slice";
import { searchData } from "../store/search-slice";
import { getInvoiceCompany } from "../store/get-invoice-detail";

const InvoiceBar = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState();
  const [itemsPerPage] = useState(10);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.invoiceListReducer.data);
  console.log(data);
  //invoice data
  const invoices = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  // //count of first render invoice
  const InvoiceListcount = useSelector(
    (state) => state.invoiceListReducer.count
  ); //count of first render invoice
  // const SearchListcount = useSelector((state) => state.searchReducer.count);

  //search results
  const searchResults = useSelector((state) => state.searchReducer.searchData),
    resultCount = useSelector((state) => state.searchReducer.count);
  //console.log("search", searchResults);

  // pagination list

  const nextPageData = useSelector((state) => state.paginationReducer.pageData);

  //next button
  const nextBtn = useSelector((state) => state.invoiceListReducer.next);

  //Invoice List
  useEffect(() => {
    if (currentPage === 1 && search.trim() === "") {
      let token = localStorage.getItem("token");
      dispatch(getInvoicList(token));
      dispatch(getInvoiceListActions.addInvoices(invoices));
      dispatch(getInvoiceListActions.addInvoices(invoices));
      setCount(InvoiceListcount);
    } else if (currentPage > 1 && currentPage !== 1) {
      dispatch(getInvoiceListActions.addInvoices(nextPageData));
      setCount(InvoiceListcount);
    } else if (search.trim() !== "") {
      dispatch(getInvoiceListActions.addInvoices(searchResults));

      setCount(resultCount);
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    currentPage,
    nextBtn,
    nextPageData,
    search,
    searchResults,
    resultCount,
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
