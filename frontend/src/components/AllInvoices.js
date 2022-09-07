import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AllInvoices.module.css";
import { IoIosAdd } from "react-icons/io";
import InvoiceBar from "./InvoiceBar";
import { uiActions } from "./store/Ui-slice";
const AllInvoices = () => {
  const [selectInput, setSelectInput] = useState("all");
  const [filter, setFilter] = useState([]);

  const invoiceNumber = useSelector((state) => state.action.length);
  const isPending = useSelector((state) =>
    state.action.value.map((el) => el.isPending)
  );

  const invoiceArray = useSelector((state) => state.action.value);
  const dispatch = useDispatch();
  useEffect(() => {
    filterHandeler();
  }, [selectInput, invoiceArray]);

  const formToggleHandeler = () => {
    dispatch(uiActions.toggleForm());
  };
  const selectHandeler = (e) => {
    setSelectInput(e.target.value);
  };

  function filterHandeler() {
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
  }

  return (
    <Fragment>
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
              {" "}
              <span className={classes.icon}>
                <IoIosAdd />
              </span>{" "}
              New Invoice{" "}
            </button>
          </div>
        </div>

        <InvoiceBar filtered={filter} />
      </div>
    </Fragment>
  );
};
export default AllInvoices;
