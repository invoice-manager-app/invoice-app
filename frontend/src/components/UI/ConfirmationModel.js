import ReactDOM from "react-dom";
import { Fragment } from "react";
import classes from "./ConfirmationModel.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/Ui-slice";

const Model = ({
  message,
  deleteCompany,
  selectedCompany,
  hideModel,
  getAllCompanies,
}) => {
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const deleteHandler = (slug, name, email) => {
    deleteCompany(slug, name, email);
    getAllCompanies(token);
  };
  return (
    <div className={classes.model}>
      <p>{message}</p>
      <div className={classes.actions}>
        <button
          type="button"
          onClick={() =>
            deleteHandler(
              selectedCompany.slug,
              selectedCompany.name,
              selectedCompany.email
            )
          }
        >
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

const ConfirmationModel = ({
  deleteCompany,
  selectedCompany,
  getAllCompanies,
}) => {
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
          selectedCompany={selectedCompany}
          hideModel={hideModel}
          getAllCompanies={getAllCompanies}
          deleteCompany={deleteCompany}
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
