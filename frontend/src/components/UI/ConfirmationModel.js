import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./Modal.module.css";
const Model = (props) => {
  const { msgBack, onClose } = props;
  console.log(msgBack);

  return (
    <div className={classes.model}>
      <button className={classes.close} onClick={onClose}>
        <AiOutlineClose />
      </button>
      {msgBack.map((msg, i) => {
        return (
          <Fragment key={i}>
            <p className={!msg.response && !msg.mssage && classes.error}>
              {msg.response} <br></br>
              {msg.message}
            </p>
          </Fragment>
        );
      })}
    </div>
  );
};

const Overlay = () => {
  return <div className={classes.overlay} />;
};

const ConfirmationModel = (props) => {
  const { responseBack, onClose } = props;
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Overlay />,
        document.getElementById("overlay-root")
      )}
      {ReactDOM.createPortal(
        <Model msgBack={responseBack} onClose={onClose} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};
export default ConfirmationModel;
