import { Fragment, useCallback } from "react";
import { uiActions } from "../store/Ui-slice";
import { useDispatch, useSelector } from "react-redux";
import classes from "./InformHeader.module.css";
import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "../store/action-creator";

import ConfirmationModel from "./UI/ConfirmationModel";
import { editStatus } from "../store/edit-invoice-slice";

const InformHeader = ({ isPending, invoiceItem, id }) => {
  /// const [invoiceStatus, setInvoiceStatus] = useState(isPending);

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

  //print invoice
  const printHandler = () => {
    let token = localStorage.getItem("token"); // token

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8000/invoice/${id}/generate_pdf/`, requestOptions)
      .then((response) => response.blob())
      .then((blob) => {
        console.log(blob);
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "Invoice.pdf";
        alink.click();
      })
      .catch((error) => console.log("error", error));
  };

  //Delete Inoice

  const deleteInvoiceHandler = () => {
    dispatch(deleteInvoice(invoice_code, token));
    dispatch(uiActions.hideDeleteConfirm());
    navigate("/");
  };

  const statusHandeler = useCallback(() => {
    //setInvoiceStatus((prevState) => !prevState);

    let token = localStorage.getItem("token"); // token
    let obj = {
      id,
      token,
      status: isPending === "pending" ? "paid" : "pending",
    };

    dispatch(editStatus(obj));
  }, [dispatch, id, isPending]);

  const editHandeler = () => {
    dispatch(uiActions.toggleForm());
  };
  // console.log("header", isPending);

  const paidBtnClass = isPending === "pending" ? classes.paid : classes.pending;
  return (
    <Fragment>
      {deleteConfirmation && (
        <ConfirmationModel deleteHandler={deleteInvoiceHandler} />
      )}
      <div className={classes.navActions}>
        <div className={classes.state}>
          <div className={isPending === "pending" ? "status" : "status paid"}>
            <span> {isPending} </span>
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
            {isPending === "pending" ? "Mark as Paid" : "Mark as Pending"}
          </button>

          <button className={classes.printBtn} onClick={printHandler}>
            Print
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default InformHeader;
