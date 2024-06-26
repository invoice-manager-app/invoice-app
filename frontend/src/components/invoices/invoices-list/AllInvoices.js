import { Fragment, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "../../../store/Ui-slice";
import { getInvoiceCompany } from "../../../store/get-invoice-detail";
import { getInvoices } from "../../../store/invoice-slice";
import Notification from "../../UI/Notification";
import Search from "../../UI/Search";
import FilterInvoices from "../../UI/FilterInvoices";
import PaginationComponent from "../../UI/Pagination";

import classes from "./AllInvoices.module.css";

const AllInvoices = () => {
  let { token } = useSelector((state) => state.authReducer);
  let currentPageNum = parseInt(sessionStorage.getItem("current-page"));

  const [currentPage, setCurrentPage] = useState(currentPageNum || 1);
  const [selectInput, setSelectInput] = useState(
    localStorage.getItem("filter") || ""
  );

  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state.invoiceReducer);
  //fetch invoice data
  useEffect(() => {
    const obj = {
      token,
      currentPage,
    };
    dispatch(getInvoices(obj));
  }, [currentPage, dispatch]);

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

  /********************************************************************************* */
  //Search

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
              currentPage={currentPage}
              search={search}
              setSelectInput={setSelectInput}
              selectInput={selectInput}
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
          filter={selectInput}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {invoices && (
          <InvoiceBar
            search={search}
            currentPage={currentPage}
            invoices={invoices.results}
          />
        )}
        {invoices && invoices.count > 10 && (
          <PaginationComponent
            count={invoices.count}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </Fragment>
  );
};
export default AllInvoices;
