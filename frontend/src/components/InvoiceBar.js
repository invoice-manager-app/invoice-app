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
const InvoiceBar = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // const [data, setData] = useState([]);
  const data = useSelector((state) => state.invoiceListReducer.data);
  const dispatch = useDispatch();

  //invoice data
  const invoices = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );
  console.log(invoices);

  // pagination list
  const nextPageList = useSelector((state) => state.paginationReducer.pageData);
  console.log(nextPageList);
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
    }
  }, [nextPageList, nextBtn, dispatch]);

  //get current item
  // const indexOfLastInvoice = invoices && invoices.length;
  // const indexOfFirstInvoice = 0;
  // const currentInvoice =
  //   invoices && invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

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
        />
      )}
    </Fragment>
  );
};
export default memo(InvoiceBar);
