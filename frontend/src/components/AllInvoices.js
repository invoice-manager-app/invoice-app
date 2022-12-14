import { Fragment, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AllInvoices.module.css";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "../store/Ui-slice";
import { getInvoiceCompany } from "../store/get-invoice-detail";
import Notification from "./UI/Notification";
import Search from "./UI/Search";
import FilterInvoices from "./UI/FilterInvoices";
import { filterInvoice, invoicePagination } from "../store/filter-slice";
import { getFilteredSearch } from "../store/filter-search-slice";
const AllInvoices = () => {
  let currentPageNum = parseInt(sessionStorage.getItem("current-page"));

  const [currentPage, setCurrentPage] = useState(currentPageNum || 1);

  const [selectInput, setSelectInput] = useState("");

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const notification = useSelector((state) => state.ui.notification);

  //count of first render invoice
  const invoice_list = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  //filter Data
  useEffect(() => {
    let token = localStorage.getItem("token");

    if (selectInput && search === "") {
      const obj = {
        token,
        filter: selectInput,
        number: currentPage,
      };
      if (currentPage === 1) {
        dispatch(filterInvoice(obj));
      } else {
        dispatch(invoicePagination(obj));
      }
    }
  }, [selectInput, search, dispatch, currentPage]);

  //filter Data with search
  useEffect(() => {
    let token = localStorage.getItem("token");

    if (selectInput !== "" && search !== "") {
      const obj = {
        token,
        filter: selectInput,
        number: currentPage,
        name: search,
      };
      if (currentPage === 1) {
        dispatch(getFilteredSearch(obj));
      }
    }
  }, [selectInput, search, dispatch, currentPage]);

  //toggle invoice form
  const formToggleHandeler = useCallback(() => {
    let token = localStorage.getItem("token");
    dispatch(getInvoiceCompany(token));

    dispatch(uiActions.toggleForm());
  }, [dispatch]);

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}

      <div className={classes["invoice-section"]}>
        <div className={classes.invoices}>
          <div>
            <h1>Invoices</h1>
            <p>
              There are <span> {invoice_list && invoice_list.count}</span> total
              invoices
            </p>
          </div>
          <div className={classes.actions}>
            <FilterInvoices
              selectInput={selectInput}
              setSelectInput={setSelectInput}
            />
            <button onClick={formToggleHandeler} className={classes.button}>
              <span className={classes.icon}>
                <IoIosAdd />
              </span>
              New Invoice
            </button>
          </div>
        </div>
        <Search setSearch={setSearch} search={search} />
        <InvoiceBar
          search={search}
          filter={selectInput}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
