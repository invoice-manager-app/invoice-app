import { invoiceAction } from "../store/actions";
import { uiActions } from "../store/Ui-slice";
import { useDispatch } from "react-redux";
import classes from "./InformHeader.module.css";
import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "../store/action-creator";
import { getInvoicList } from "../store/get-invoice-slice";

const InformHeader = ({ isPending, invoiceItem, id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const { invoice_code } = invoiceItem;
  const deleteHandeler = () => {
    dispatch(deleteInvoice(invoice_code, token));
    navigate("/invoice");
    dispatch(getInvoicList(token));
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
  );
};

export default InformHeader;
