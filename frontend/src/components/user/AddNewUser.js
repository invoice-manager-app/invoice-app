import { useFormik } from "formik";

import { useDispatch } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewUser.module.css";
import { invoiceAction } from "../store/actions";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../../schemas";
import { Fragment } from "react";

const AddNewUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: userSchema,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      invoiceAction.createUser({
        id: Math.random().toString(),
        email: values.email,
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
      })
    );

    if (values.email !== "" && values.userName !== "") {
      navigate("/create-company");
    }
  };
  if (
    values.userName !== "" &&
    !errors.userName &&
    values.email !== "" &&
    !errors.email
  ) {
    formIsValid = true;
  }
  return (
    <Fragment>
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
          label="User-name"
          value={values.userName}
          onChange={handleChange}
          id="userName"
          onBlur={handleBlur}
          className={errors.userName && touched.userName ? "error-input" : ""}
        />
        {errors.userName && touched.userName && (
          <p className="error-msg"> {errors.userName} </p>
        )}

        <Input
          type="text"
          label="First Name"
          value={values.firstName}
          onChange={handleChange}
          id="firstName"
        />

        <Input
          type="text"
          label="Last Name"
          value={values.lastName}
          onChange={handleChange}
          id="lastName"
        />

        <button disabled={!formIsValid} type="submit">
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default AddNewUser;
