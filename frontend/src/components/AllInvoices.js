import { Fragment, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AllInvoices.module.css";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "../store/Ui-slice";
import { getInvoiceCompany } from "../store/get-invoice-detail";
import Notification from "./UI/Notification";
import Search from "./UI/Search";
import FilterInvoices from "./UI/FilterInvoices";

const AllInvoices = () => {
  let currentPageNum = parseInt(sessionStorage.getItem("current-page"));

  const [currentPage, setCurrentPage] = useState(currentPageNum || 1);
  const [count, setCount] = useState(null);

  const [selectInput, setSelectInput] = useState(
    localStorage.getItem("filter") || ""
  );

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const notification = useSelector((state) => state.ui.notification);

  //count of first render invoice
  const invoice_list = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

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
              currentPage={currentPage}
              search={search}
              setCount={setCount}
              count={count}
            />
            <button onClick={formToggleHandeler} className={classes.button}>
              <span className={classes.icon}>
                <IoIosAdd />
              </span>
              New Invoice
            </button>
          </div>
        </div>
        <Search
          setSearch={setSearch}
          search={search}
          currentPage={currentPage}
          filter={selectInput}
          setCount={setCount}
        />
        <InvoiceBar
          search={search}
          filter={selectInput}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setCount={setCount}
          count={count}
        />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
