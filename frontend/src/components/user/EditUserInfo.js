import { Fragment } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { editUserRequest } from "../../store/action-creator";
import Notification from "../UI/Notification";
import Input from "../UI/Inputs";
import { userSchema } from "../../schemas";

import classes from "./EditUserInfo.module.css";

//start comonent
const EditUserInfo = ({ userData }) => {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  //notification state
  const notification = useSelector((state) => state.ui.notification);

  //form validation
  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
    },
    validationSchema: userSchema,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // edit userInfo asyn function
    dispatch(editUserRequest(token, values));
  };
  if (
    values.username !== "" &&
    !errors.username &&
    values.email !== "" &&
    !errors.email
  ) {
    formIsValid = true;
  }

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}
      <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
        <Input
          type="text"
          label="E-mail"
          value={values.email}
          onChange={handleChange}
          id="email"
          onBlur={handleBlur}
          className={errors.email && touched.email ? "error-input" : ""}
        />
        {errors.email && touched.email && (
          <p className="error-msg"> {errors.email} </p>
        )}
        <Input
          type="text"
          label="username"
          value={values.username}
          onChange={handleChange}
          id="username"
          onBlur={handleBlur}
          className={errors.username && touched.username ? "error-input" : ""}
        />
        {errors.username && touched.username && (
          <p className="error-msg"> {errors.username} </p>
        )}
        <Input
          type="text"
          label="First Name"
          value={values.first_name}
          onChange={handleChange}
          id="first_name"
        />
        <Input
          type="text"
          label="Last Name"
          value={values.last_name}
          onChange={handleChange}
          id="last_name"
        />
        <button disabled={!formIsValid} type="submit">
          Submit Edit
        </button>
      </form>
    </Fragment>
  );
};

export default EditUserInfo;
