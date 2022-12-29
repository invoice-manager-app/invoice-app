import {
  Fragment,
  useState,
  useCallback,
  useReducer,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AllInvoices.module.css";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "../store/Ui-slice";
import { getInvoiceCompany } from "../store/get-invoice-detail";
import Notification from "./UI/Notification";
import Search from "./UI/Search";
import FilterInvoices from "./UI/FilterInvoices";
import PaginationComponent from "./UI/Pagination";

import LoadingSpinner from "./UI/LoadingSpinner";
import AuthContext from "../context/auth-context";

const invoiceFn = (state, action) => {
  if (action.state === "SUCCESS") {
    return {
      invoices: action.data,
      count: action.count,
      responseMsg: null,
    };
  } else if (action.state === "PAGINATION") {
    return {
      invoices: action.pagination,
      count: action.count,
      responseMsg: action.responseMsg,
    };
  } else if (action.state === "SEARCH") {
    return {
      invoices: action.data,
      count: action.count,
      responseMsg: action.responseMsg,
    };
  } else if (action.state === "FILTER") {
    return {
      invoices: action.data,
      count: action.count,
      responseMsg: action.responseMsg,
    };
  } else if (action.state === "ERROR") {
    return {
      invoices: state.data,
      count: state.count,
      responseMsg: action.responseMsg,
    };
  } else {
    return {
      invoices: [],
      count: 0,
      responseMsg: null,
    };
  }
};
const AllInvoices = () => {
  const authCtx = useContext(AuthContext);
  let currentPageNum = parseInt(sessionStorage.getItem("current-page"));
  let token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(currentPageNum || 1);
  const [selectInput, setSelectInput] = useState(
    localStorage.getItem("filter") || ""
  );
  const [invoiceState, invoiceDispatch] = useReducer(invoiceFn, {
    invoices: [],
    count: 0,
    responseMsg: null,
  });

  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const invoice_list_api = useRef(
    currentPage > 1
      ? `http://localhost:8000/invoice/list/?page=${currentPage}`
      : "http://localhost:8000/invoice/list/"
  );

  const notification = useSelector((state) => state.ui.notification);

  const { isFetching: getInvoices, refetch: gettingInvoices } = useQuery(
    "getInvoice/list",

    async () => {
      if (search.trim() !== "" || selectInput !== "") return;
      try {
        const response = await fetch(invoice_list_api.current, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          authCtx.logout();
        }

        const data = await response.json();

        invoiceDispatch({
          state: "SUCCESS",
          data: data.results,
          count: data.count,
        });
      } catch (error) {
        invoiceDispatch({
          state: "ERROR",
          responseMsg: error.message,
        });
      }
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (currentPage > 1 && search.trim() === "" && selectInput === "") {
      invoice_list_api.current = `http://localhost:8000/invoice/list/?page=${currentPage}`;
    } else if (
      currentPage === 1 &&
      search.trim() === "" &&
      selectInput === ""
    ) {
      invoice_list_api.current = `http://localhost:8000/invoice/list/`;
    } else {
      return;
    }
    gettingInvoices();
  }, [currentPage, gettingInvoices, search, selectInput]);

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
  console.log(invoiceState);

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
              invoiceDispatch={invoiceDispatch}
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
          invoiceDispatch={invoiceDispatch}
        />
        <InvoiceBar
          search={search}
          currentPage={currentPage}
          invoices={invoiceState.invoices}
        />
        <PaginationComponent
          count={invoiceState.count}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
