import { Fragment } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineLeft } from "react-icons/ai";

import classes from "./InvoiceInform.module.css";
import { invoiceAction } from "../store/actions";
import { uiActions } from "../store/Ui-slice";
import EditInvoice from "./EditInvoice";

const InoviceInform = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputFields = useSelector((state) => state.action.value);

  const params = useParams();

  const invoiceItem = inputFields.find((el) => el.id === params.invoiceId);
  console.log(invoiceItem);
  const { isPending, id } = invoiceItem;

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
      <EditInvoice id={invoiceItem.id} />
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
            <p>{invoiceItem.productionDescription}</p>
          </div>
          <div className={classes.right}>
            <p> {invoiceItem.city} </p>
            <p> {invoiceItem.streetAddress} </p>
            <p> {invoiceItem.Zcode} </p>
            <p> {invoiceItem.country} </p>
          </div>
        </div>
        <div className={classes.mid}>
          <div className={classes.date}>
            <h4>Invoice Date</h4>
            <p>{invoiceItem.date}</p>

            <h4>Payment Date</h4>
            <p>{invoiceItem.paymentDue}</p>
          </div>
          <div className={classes.billTo}>
            <h4>Bill To</h4>
            <p> {invoiceItem.clientName} </p>
            <p>{invoiceItem.clientAddress} </p>
            <p>{invoiceItem.clientZcode}</p>
            <p>{invoiceItem.clientCountry}</p>
          </div>
          <div className={classes.clientMail}>
            <h4>Sent To</h4>
            <p>{invoiceItem.clientMail}</p>
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
              {invoiceItem.items.map((item) => {
                return (
                  <ul key={item.id}>
                    <li> {item.itemName} </li>
                    <li> {item.qty} </li>
                    <li> {item.price} </li>
                    <li> {item.qty * item.price} </li>
                  </ul>
                );
              })}
            </div>
          </div>
          <div className={classes.amount}>
            <p>Amount Due</p>
            <p>
              $
              {invoiceItem.items
                .map((el) => +el.qty * +el.price)
                .reduce((curr, i) => curr + i)}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default InoviceInform;
