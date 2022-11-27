import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPagination } from "../store/pagination-slice";
import Pagination from "./UI/Pagination";
import { getInvoicList } from "../store/get-invoice-slice";
const InvoiceBar = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const dispatch = useDispatch();

  //invoice data
  const invoices = useSelector((state) => state.paginationReducer.pageData);

  //current page
  const currentPage = useSelector(
    (state) => state.paginationReducer.currentPage
  );

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("inv");
    const obj = {
      num: currentPage,
      token,
    };
    dispatch(getPagination(obj));
  }, [currentPage, dispatch]);

  //get current item
  const indexOfLastInvoice = invoices && invoices.length;
  const indexOfFirstInvoice = 0;
  const currentInvoice =
    invoices && invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

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
        {invoices &&
          currentInvoice.map((item) => (
            <InvoiceItem
              key={item.invoice_code}
              id={item.invoice_code}
              name={item.client_name}
              items={item.items}
              date={item.created_at}
              status={item.status}
            />
          ))}
      </div>

      {invoices && invoices.length !== 0 && (
        <Pagination data={invoices} itemsPerPage={itemsPerPage} />
      )}
    </Fragment>
  );
};
export default memo(InvoiceBar);
