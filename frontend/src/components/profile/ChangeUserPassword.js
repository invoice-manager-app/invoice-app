import { useState, Fragment } from "react";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/Ui-slice";
import Notification from "../UI/Notification";
import Input from "../UI/Inputs";

import classes from "./ChangePassword.module.css";
//import { ChangePassword } from "../../schemas/changepassword";

const ChangeUserPassword = () => {
  const [resMsg, setResMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  //notification state
  const notification = useSelector((state) => state.ui.notification);
  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      uiActions.notification({
        status: "pending",
        message: null,
      })
    );
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("old_password", values.currentPassword);
    formdata.append("new_password", values.newPassword);
    formdata.append("confirm_new_password", values.passwordConfirmation);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/change_password/",
        requestOptions
      );

      const data = await response.json();
      if (response.status === 400) {
        throw new Error(
          data.response_msg ||
            "Something went wrong, please make sure you entered the correct password"
        );
      }
      setResMsg(data.response_msg);

      dispatch(
        uiActions.notification({
          status: "succeed",
          message: data.response_msg,
        })
      );
      dispatch(uiActions.togglePassword());
    } catch (error) {
      setResMsg(error.message);
      dispatch(
        uiActions.notification({
          status: "error",
          message: null,
        })
      );
    }

    if (
      values.currentPassword !== "" &&
      values.newPassword !== "" &&
      values.passwordConfirmation !== ""
    ) {
      navigate("/profile");
    }
  };
  if (
    values.currentPassword !== "" &&
    !errors.currentPassword &&
    values.newPassword !== "" &&
    !errors.newPassword &&
    values.passwordConfirmation !== "" &&
    !errors.passwordConfirmation
  ) {
    formIsValid = true;
  }
  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}
      <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
        <h1>Change Password</h1>
        <Input
          type="text"
          label="Current Password"
          value={values.currentPassword}
          onChange={handleChange}
          id="currentPassword"
          onBlur={handleBlur}
          className={
            errors.currentPassword && touched.currentPassword
              ? "error-input"
              : ""
          }
        />
        {errors.currentPassword && touched.currentPassword && (
          <p className="error-msg"> {errors.currentPassword} </p>
        )}
        <Input
          type="text"
          label="New Password"
          value={values.newPassword}
          onChange={handleChange}
          id="newPassword"
          onBlur={handleBlur}
          className={
            errors.newPassword && touched.newPassword ? "error-input" : ""
          }
        />{" "}
        {errors.newPassword && touched.newPassword && (
          <p className="error-msg"> {errors.newPassword} </p>
        )}
        <Input
          type="text"
          label="Confirm Password"
          value={values.passwordConfirmation}
          onChange={handleChange}
          id="passwordConfirmation"
          onBlur={handleBlur}
          className={
            errors.passwordConfirmation && touched.passwordConfirmation
              ? "error-input"
              : ""
          }
        />{" "}
        {errors.passwordConfirmation && touched.passwordConfirmation && (
          <p className="error-msg"> {errors.passwordConfirmation} </p>
        )}
        {resMsg !== "" && <p className="exist-info"> {resMsg} </p>}
        {(!notification ||
          (notification && notification.status !== "pending")) && (
          <button disabled={!formIsValid} type="submit">
            Change Password
          </button>
        )}
        {notification && notification.status === "pending" && (
          <p> Please Wait.... </p>
        )}
      </form>
    </Fragment>
  );
};

export default ChangeUserPassword;
