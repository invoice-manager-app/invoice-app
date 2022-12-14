import { Fragment, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { uiActions } from "../store/Ui-slice";
import { useDispatch, useSelector } from "react-redux";
import classes from "./InformHeader.module.css";
import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "../store/action-creator";

import ConfirmationModel from "./UI/ConfirmationModel";
import { editStatus } from "../store/edit-invoice-slice";
import { getInvoicList } from "../store/get-invoice-slice";
import Notification from "./UI/Notification";
const InformHeader = ({ isPending, invoiceItem, id }) => {
  /// const [invoiceStatus, setInvoiceStatus] = useState(isPending);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //confirmation Object
  const deleteConfirmation = useSelector((state) => state.ui.deleteConfirm);
  //notification state
  const notification = useSelector((state) => state.ui.notification);
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const { invoice_code } = invoiceItem;
  // delete Confirmation
  const confirmationModel = () => {
    dispatch(
      uiActions.showDeleteConfirm({
        message: `Delete invoice permanently? `,
      })
    );
  };
  //status change
  const statusHandeler = useCallback(() => {
    let token = localStorage.getItem("token"); // token
    let obj = {
      id,
      token,
      status: isPending === "pending" ? "paid" : "pending",
    };

    dispatch(editStatus(obj));
  }, [dispatch, id, isPending]);
  // Print endpoint
  const { isFetching: isPrinting, refetch: rePrint } = useQuery(
    "printInvoice",
    async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/invoice/${id}/generate_pdf/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            redirect: "follow",
          }
        );
        if (!response.ok) {
          throw new Error(response.statusText || "Somethin went wrong");
        }
        const blob = await response.blob();

        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "Invoice.pdf";
        alink.click();
      } catch (error) {
        dispatch(
          uiActions.notification({
            status: "error",
            message: error.message,
          })
        );
      }
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  // send reminder
  const { isFetching: isSending, refetch: resend } = useQuery(
    "sendReminder",
    async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/invoice/${id}/send_reminder/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            redirect: "follow",
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(response.statusText || "Somethin went wrong");
        } else {
          dispatch(
            uiActions.notification({
              status: "success",
              message: data.message,
            })
          );
        }
      } catch (error) {
        dispatch(
          uiActions.notification({
            status: "error",
            message: error.message,
          })
        );
      }
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  //print invoice handler
  const printHandler = async () => {
    rePrint();
  };

  //Delete Inoice
  const deleteInvoiceHandler = () => {
    dispatch(deleteInvoice(invoice_code, token));
    dispatch(uiActions.hideDeleteConfirm());
    dispatch(getInvoicList(token));
    navigate("/");
    sessionStorage.removeItem("current-page");
  };

  //edit form handler
  const editHandeler = () => {
    dispatch(uiActions.toggleForm());
  };
  //class switch
  const paidBtnClass = isPending === "pending" ? classes.paid : classes.pending;
  return (
    <Fragment>
      {deleteConfirmation && (
        <ConfirmationModel deleteHandler={deleteInvoiceHandler} />
      )}
      {notification &&
        notification.message !== undefined &&
        notification.message !== null && <Notification />}
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
          <button
            disabled={isSending}
            className={classes.reminderBtn}
            onClick={resend}
          >
            {isSending ? "Sending..." : "Send Reminder"}
          </button>
          <button
            disabled={isPrinting}
            className={classes.printBtn}
            onClick={printHandler}
          >
            {isPrinting ? "Printing..." : "Print"}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default InformHeader;
