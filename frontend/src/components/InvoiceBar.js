import ReactPaginate from "react-paginate";
import { Fragment, useState, memo, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPagination } from "../store/pagination-slice";
import Pagination from "./UI/Pagination";
import { useCallback } from "react";
const InvoiceBar = ({ invoiceList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(null);

  const [data, setData] = useState([]);

  const paginateHandler = useCallback((number) => {
    setCurrentPage(number);
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");

    const pagination = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/invoice/list/?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setData(data.results);
        setNextPage(data.next);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    pagination();
  }, [currentPage, paginateHandler]);
  console.log(data);

  //get current item
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoice = data.slice(indexOfFirstInvoice, indexOfLastInvoice);

  return (
    <Fragment>
      <ul className={classes.categories}>
        <li>ORDER ID</li>
        <li>CREATED</li>
        <li>CUSTOMER</li>
        <li>TOTAL</li>
        <li>STATUS</li>
      </ul>
      {data.map((item) => (
        <InvoiceItem
          key={item.invoice_code}
          id={item.invoice_code}
          name={item.client_name}
          items={item.items}
          date={item.created_at}
          status={item.status}
        />
      ))}

      <Pagination
        data={data}
        itemsPerPage={itemsPerPage}
        paginate={paginateHandler}
      />
    </Fragment>
  );
};
export default memo(InvoiceBar);
