import ReactDOM from "react-dom";
import { Fragment } from "react";
import classes from "./ConfirmationModel.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/Ui-slice";

const Model = ({ message, deleteHandler, hideModel }) => {
  return (
    <div className={classes.model}>
      <p>{message}</p>
      <div className={classes.actions}>
        <button type="button" onClick={deleteHandler}>
          Delete
        </button>
        <button typ="button" onClick={hideModel}>
          Close
        </button>
      </div>
    </div>
  );
};

const Backdrop = ({ hideModel }) => {
  return <div className={classes.backdrop} onClick={hideModel} />;
};

const ConfirmationModel = ({ deleteHandler }) => {
  const deleteConfirmation = useSelector((state) => state.ui.deleteConfirm);
  const dipatch = useDispatch();
  //hide model
  const hideModel = () => {
    dipatch(uiActions.hideDeleteConfirm());
  };
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Model
          message={deleteConfirmation.message}
          deleteHandler={deleteHandler}
          hideModel={hideModel}
        />,
        document.getElementById("model")
      )}
      {ReactDOM.createPortal(
        <Backdrop hideModel={hideModel} />,
        document.getElementById("backdrop")
      )}
    </Fragment>
  );
};

export default ConfirmationModel;
