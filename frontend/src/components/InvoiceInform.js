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
  const inputFields = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  const params = useParams();
  const invoiceItem = inputFields.find(
    (el) => el.invoice_code === params.invoiceId
  );

  //fetch invoice detail
  useEffect(() => {
    const token = localStorage.getItem("token");
    const invoice_code = inputFields.map((el) => el.invoice_code);
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
  }, [inputFields]);

  const { isPending, id } = invoiceItem;
  if (invoiceDetail === undefined) {
    return;
  }
  if (!invoiceItem) {
    navigate("/invoice");
  }
  //loading state

  return (
    <Fragment>
      {/* <EditInvoice id={invoiceItem.id} /> */}
      <Link className={classes.icon} to="/invoice">
        <AiOutlineLeft /> <span>Go Back</span>
      </Link>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {" "}
          <InformHeader
            isPending={isPending}
            invoiceItem={invoiceItem}
            id={id}
          />
          <div className={classes.details}>
            <div className={classes.top}>
              <div className={classes.left}>
                <p>
                  <span>#</span>
                  {invoiceItem.id}
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
