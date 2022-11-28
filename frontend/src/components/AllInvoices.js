import { Fragment, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AllInvoices.module.css";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "../store/Ui-slice";
import { getInvoiceCompany } from "../store/get-invoice-detail";
import { getInvoicList } from "../store/get-invoice-slice";
import Notification from "./UI/Notification";
import LoadingSpinner from "./UI/LoadingSpinner";
import Search from "./UI/Search";
import FilterInvoices from "./UI/FilterInvoices";
const AllInvoices = () => {
  const [selectInput, setSelectInput] = useState("all");

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const invoiceNumber = useSelector((state) => state.action.length);

  const notification = useSelector((state) => state.ui.notification);

  //toggle invoice form
  const formToggleHandeler = useCallback(() => {
    let token = localStorage.getItem("token");

    dispatch(getInvoiceCompany(token));

    dispatch(uiActions.toggleForm());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    dispatch(getInvoicList(token));
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
            <p>There are {invoiceNumber} total invoices</p>
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
        <InvoiceBar search={search} />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
