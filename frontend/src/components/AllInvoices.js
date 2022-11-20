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
const AllInvoices = () => {
  const [selectInput, setSelectInput] = useState("all");
  const [filter, setFilter] = useState([]);
  const dispatch = useDispatch();

  const invoiceNumber = useSelector((state) => state.action.length);

  const invoiceArray = useSelector((state) => state.action.value);

  const notification = useSelector((state) => state.ui.notification);

  //invoice List
  const invoiceList = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  //filter function
  const filterHandeler = useCallback(() => {
    switch (selectInput) {
      case "pending":
        return setFilter(
          invoiceArray.filter((invoice) => invoice.isPending === true)
        );
      case "paid":
        return setFilter(
          invoiceArray.filter((invoice) => invoice.isPending === false)
        );
      default:
        return setFilter(invoiceArray);
    }
  }, [invoiceArray, selectInput]);

  //filter invoices
  useEffect(() => {
    filterHandeler();
  }, [selectInput, invoiceArray, filterHandeler, dispatch]);

  //toggle invoice form
  const formToggleHandeler = useCallback(() => {
    let token = localStorage.getItem("token");

    dispatch(getInvoiceCompany(token));

    dispatch(uiActions.toggleForm());
  }, [dispatch]);
  const selectHandeler = (e) => {
    setSelectInput(e.target.value);
  };

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
            <div>
              <label htmlFor="filter">filter by</label>
              <select id="filter" onChange={selectHandeler} value={selectInput}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                {/*<option value="Paid">Paid</option>*/}
              </select>
            </div>
            <button onClick={formToggleHandeler} className={classes.button}>
              <span className={classes.icon}>
                <IoIosAdd />
              </span>
              New Invoice
            </button>
          </div>
        </div>
        <InvoiceBar invoiceList={invoiceList} />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
