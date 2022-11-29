import { Fragment, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineLeft } from "react-icons/ai";

import classes from "./InvoiceInform.module.css";

import EditInvoice from "./EditInvoice";
import InformHeader from "./InformHeader";
import LoadingSpinner from "./UI/LoadingSpinner";

const InoviceInform = () => {
  const [invoiceDetail, setInvoiceDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dataInvoice = useSelector((state) => state.invoiceListReducer.data);

  const params = useParams();
  const invoiceItem =
    dataInvoice &&
    dataInvoice.find((el) => el.invoice_code === params.invoiceId);
  //fetch invoice detail
  useEffect(() => {
    const token = localStorage.getItem("token");
    const invoice_code =
      dataInvoice && dataInvoice.map((el) => el.invoice_code);
    setIsLoading(true);

    const link = `http://localhost:8000/invoice/${invoice_code[0]}/`;
    const fetchInvoice = async () => {
      try {
        const response = await fetch(link, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoading(false);

        const data = await response.json();
        setInvoiceDetail(data);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [dataInvoice]);
  useEffect(() => {
    if (!invoiceItem) {
      navigate("/invoice");
    }
  }, [invoiceItem, navigate]);
  if (invoiceDetail === undefined) {
    return;
  }

  //previous page
  const previousHandler = () => {
    navigate(-1);
  };
  console.log(dataInvoice.map((el) => el.client_name)[0]);
  //loading state
  console.log("status", invoiceDetail.status);
  return (
    <Fragment>
      <EditInvoice
        id={invoiceDetail.invoice_code}
        editingInovoice={invoiceDetail}
      />
      <button className={classes.icon} onClick={previousHandler}>
        <AiOutlineLeft /> <span>Go Back</span>
      </button>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {" "}
          <InformHeader
            isPending={invoiceDetail.status}
            invoiceItem={invoiceItem}
            id={invoiceDetail.invoice_code}
          />
          <div className={classes.details}>
            <div className={classes.top}>
              <div className={classes.left}>
                <p>
                  <span>#</span>
                  {invoiceItem.invoice_code}
                </p>
                <p>{invoiceItem.description} </p>
              </div>
              {/* <div className={classes.right}>
    <p> {invoiceItem.client_city} </p>
    <p> {invoiceItem.client_address} </p>
    <p> {invoiceItem.Zcode} </p>
    <p> {invoiceItem.country} </p>
  </div> */}
            </div>
            <div className={classes.mid}>
              <div className={classes.date}>
                <h4>Invoice Date</h4>
                <p>{invoiceDetail.date}</p>

                <h4>Payment Date</h4>
                <p>{invoiceDetail.paymentDue}</p>
              </div>
              <div className={classes.billTo}>
                <h4>Bill To</h4>
                <p> {invoiceDetail.client_name} </p>
                <p>{invoiceDetail.client_address} </p>
                <p>{invoiceDetail.client_zipcode}</p>
                <p>{invoiceDetail.client_country}</p>
              </div>
              <div className={classes.clientMail}>
                <h4>Sent To</h4>
                <p>{invoiceDetail.client_email}</p>
              </div>
            </div>
            <div className={classes.bot}>
              <div>
                <div>
                  <ul>
                    <li>Item Name</li>
                    <li>QTY</li>
                    <li>Price</li>
                    <li>Total</li>
                  </ul>
                </div>
                <div>
                  {invoiceDetail.items &&
                    invoiceDetail.items.map((item) => {
                      return (
                        <ul key={item.id}>
                          <li> {item.title} </li>
                          <li> {item.quantity} </li>
                          <li> {item.unit_price} </li>
                          <li> {+item.quantity * +item.unit_price} </li>
                        </ul>
                      );
                    })}
                </div>
              </div>
              <div className={classes.amount}>
                <p>Amount Due</p>
                <p>
                  $
                  {invoiceDetail.items &&
                    invoiceDetail.items
                      .map((el) => +el.quantity * +el.unit_price)
                      .reduce((curr, i) => curr + i)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};
export default InoviceInform;
