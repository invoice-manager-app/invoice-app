import { Fragment, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineLeft } from "react-icons/ai";

import classes from "./InvoiceInform.module.css";
import { invoiceAction } from "../store/actions";
import { uiActions } from "../store/Ui-slice";
import EditInvoice from "./EditInvoice";

const InoviceInform = () => {
  const [invoiceDetail, setInvoiceDetail] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputFields = useSelector(
    (state) => state.invoiceListReducer.invoice_list
  );

  const params = useParams();
  const invoiceItem = inputFields.find(
    (el) => el.invoice_code === params.invoiceId
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const invoice_code = inputFields.map((el) => el.invoice_code);

    const fetchInvoice = async () => {
      const response = await fetch(
        `http://localhost:8000/invoice/${invoice_code[0]}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setInvoiceDetail(data);
    };

    fetchInvoice();
  }, [inputFields]);
  console.log(invoiceDetail);

  // console.log(inputFields);
  const { isPending, id } = invoiceItem;
  if (invoiceDetail === undefined) {
    return;
  }
  if (!invoiceItem) {
    navigate("/invoice");
  }
  const deleteHandeler = () => {
    navigate("/invoice");
    dispatch(invoiceAction.deleteInvoice(invoiceItem.id));
  };

  const statusHandeler = () => {
    dispatch(invoiceAction.changePendingState({ id, isPending }));

    //setPendingState((prevState) => !prevState);
  };
  const editHandeler = () => {
    // navigate(`/edit-invoice/${id}`);
    dispatch(uiActions.toggleForm());
  };
  const paidBtnClass = isPending ? classes.paid : classes.pending;
  return (
    <Fragment>
      {/* <EditInvoice id={invoiceItem.id} /> */}
      <Link className={classes.icon} to="/invoice">
        <AiOutlineLeft /> <span>Go Back</span>
      </Link>

      <div className={classes.navActions}>
        <div className={classes.state}>
          <div className={isPending ? "status" : "status paid"}>
            <span> {isPending ? "Pending" : "Paid"} </span>
          </div>
        </div>
        <div className={classes.actions}>
          <button onClick={editHandeler} className={classes.edit}>
            Edit
          </button>
          <button onClick={deleteHandeler} className={classes.delete}>
            Delete
          </button>
          <button className={paidBtnClass} onClick={statusHandeler}>
            {isPending ? "Mark as Paid" : "Mark as Pending"}
          </button>
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.top}>
          <div className={classes.left}>
            <p>
              <span>#</span>
              {invoiceItem.id}
            </p>
            <p>
              {invoiceItem.description
                ? invoiceItem.description
                : "Unknown Description"}
            </p>
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
            <p>
              {invoiceDetail.client_address
                ? invoiceDetail.client_address
                : "Unknown Address"}{" "}
            </p>
            <p>
              {invoiceDetail.client_zipcode
                ? invoiceDetail.client_zipcode
                : "Unknown zip-code"}
            </p>
            <p>
              {invoiceDetail.client_country
                ? invoiceDetail.client_country
                : "Unknow Country"}
            </p>
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
    </Fragment>
  );
};
export default InoviceInform;
