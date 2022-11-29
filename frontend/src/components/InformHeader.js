import { useState, Fragment } from "react";

import { invoiceAction } from "../store/actions";
import { uiActions } from "../store/Ui-slice";
import { useDispatch, useSelector } from "react-redux";
import classes from "./InformHeader.module.css";
import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "../store/action-creator";
import { getInvoicList } from "../store/get-invoice-slice";

import ConfirmationModel from "./UI/ConfirmationModel";
import { editStatus } from "../store/edit-invoice-slice";

const InformHeader = ({ isPending, invoiceItem, id }) => {
  const [invoiceStatus, setInvoiceStatus] = useState(
    isPending === "pending" ? true : false
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //confirmation Object
  const deleteConfirmation = useSelector((state) => state.ui.deleteConfirm);
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const { invoice_code } = invoiceItem;
  const confirmationModel = () => {
    dispatch(
      uiActions.showDeleteConfirm({
        message: `Delete invoice permanently? `,
      })
    );
  };
  const deleteInvoiceHandler = () => {
    dispatch(deleteInvoice(invoice_code, token));
    dispatch(uiActions.hideDeleteConfirm());
    navigate("/");
  };

  const statusHandeler = () => {
    setInvoiceStatus((prevState) => !prevState);

    let token = localStorage.getItem("token"); // token
    let obj = {
      id,
      token,
      status: invoiceStatus === true ? "paid" : "pending",
    };
    console.log(obj.status);
    console.log(invoiceStatus);
    dispatch(editStatus(obj));
  };

  const editHandeler = () => {
    // navigate(`/edit-invoice/${id}`);
    dispatch(uiActions.toggleForm());
  };

  const paidBtnClass = invoiceStatus === true ? classes.paid : classes.pending;
  return (
    <Fragment>
      {deleteConfirmation && (
        <ConfirmationModel deleteHandler={deleteInvoiceHandler} />
      )}
      <div className={classes.navActions}>
        <div className={classes.state}>
          <div className={invoiceStatus ? "status" : "status paid"}>
            <span> {invoiceStatus === true ? "Pending" : "Paid"} </span>
          </div>
        </div>
        <div className={classes.actions}>
          <button onClick={editHandeler} className={classes.edit}>
            Edit
          </button>
          <button onClick={confirmationModel} className={classes.delete}>
            Delete
          </button>
          <button className={paidBtnClass} onClick={statusHandeler}>
            {invoiceStatus === true ? "Mark as Paid" : "Mark as Pending"}
          </button>

          <button className={classes.printBtn}>Print</button>
        </div>
      </div>
    </Fragment>
  );
};

export default InformHeader;
