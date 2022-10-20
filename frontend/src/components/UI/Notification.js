import { useEffect } from "react";
import ReactDOM from "react-dom";
import CorrectIcon from "../icons/CorrectIcon";
import { useSelector, useDispatch } from "react-redux";
import classes from "./Notification.module.css";
import ErrorIcon from "../icons/ErrorIcons";
import CloseIcon from "../icons/CloseIcon";
import { uiActions } from "../../store/Ui-slice";
const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  //hide notification bar after X second(s)

  useEffect(() => {
    // hide notification dispatch Timer
    if (
      notification &&
      (notification.status === "succeed" || notification.status === "error")
    ) {
      const timer = setTimeout(() => {
        dispatch(uiActions.hideNotification());
      }, 3000);
      //cleanUp function
      return () => clearTimeout(timer);
    }
  }, [dispatch, notification]);

  //notification style class for each status [success - error]
  let statusClasses;
  if (
    notification &&
    notification.status &&
    notification.status === "succeed"
  ) {
    statusClasses = classes.success;
  }
  if (notification && notification.status && notification.status === "error") {
    statusClasses = classes.error;
  }

  //hide notification function handler
  const hideNotificationHandler = () => {
    dispatch(uiActions.hideNotification());
  };

  const cssClass = `${classes.notification} ${statusClasses}`;
  return ReactDOM.createPortal(
    <div className={cssClass}>
      {notification && notification.status !== "pending" && (
        <div className={classes.close} onClick={hideNotificationHandler}>
          <CloseIcon />
        </div>
      )}
      {notification.status !== "pending" && notification.status !== "error" && (
        <div className={classes["response-icon"]}>
          <CorrectIcon />
        </div>
      )}
      {notification.status === "error" && (
        <div className={classes["response-icon"]}>
          <ErrorIcon />
        </div>
      )}
      <p> {notification ? notification.message : ""} </p>
    </div>,
    document.getElementById("notification")
  );
};
export default Notification;
