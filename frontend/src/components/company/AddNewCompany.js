import { Fragment } from "react";
import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../../store/Ui-slice";
import Notification from "../UI/Notification";

const AddNewCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  //notification state
  const notification = useSelector((state) => state.ui.notification);
  //domain/company/ => Get All Companies
  //domain/company/ => Post ? create Company  name* - about - email* - number = address - avatar*
  //domain/company/slug => Delete / Get / put

  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      name: "",
      email: "",
      companyName: "",
      owner: "",
      about: "",
      number: "",
      address: "",
    },
    validationSchema: userSchema,
  });

  const onSubmit = (e) => {
    e.preventDefault();

    //HEADER
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    //body
    const formdata = new FormData();
    formdata.append("name", values.companyName);
    formdata.append("email", values.email);
    formdata.append("owner", values.name);
    formdata.append("about", values.about);
    formdata.append("number", values.number);
    formdata.append("address", values.address);

    fetch("http://127.0.0.1:8000/company/", {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        return res.json();
      })
      .then((data) => {
        dispatch(
          uiActions.notification({
            status: "succeed",
            message: data.response_message,
          })
        );

        navigate("/profile");
        dispatch(uiActions.switchToCompany());
      })
      .catch((err) => {
        dispatch(
          uiActions.notification({
            status: "error",
            message: err.message,
          })
        );
      });

    if (
      values.address !== "" &&
      values.email !== "" &&
      values.companyName !== "" &&
      values.about !== "" &&
      values.owner !== "" &&
      values.number !== ""
    ) {
      //navigate("/profile");
    }
  };
  if (
    values.address !== "" &&
    !errors.address &&
    values.email !== "" &&
    !errors.email &&
    values.companyName !== "" &&
    !errors.companyName &&
    values.about !== "" &&
    !errors.about &&
    values.number !== "" &&
    !errors.number
  ) {
    formIsValid = true;
  }

  return (
    <Fragment>
      {notification &&
        notification.message !== undefined &&
        notification.message !== null && <Notification />}
      <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
        <Input
          type="text"
          label="Company Name"
          value={values.companyName}
          onChange={handleChange}
          id="companyName"
          onBlur={handleBlur}
          className={
            errors.companyName && touched.companyName ? "error-input" : ""
          }
        />
        {errors.companyName && touched.companyName && (
          <p className="error-msg"> {errors.companyName} </p>
        )}
        <Input
          type="email"
          label="E-mail"
          value={values.email}
          onChange={handleChange}
          id="email"
          onBlur={handleBlur}
          className={errors.email && touched.email ? "error-input" : ""}
        />{" "}
        {errors.email && touched.email && (
          <p className="error-msg"> {errors.email} </p>
        )}
        <Input
          type="text"
          label="About"
          value={values.about}
          onChange={handleChange}
          id="about"
          onBlur={handleBlur}
          className={errors.about && touched.about ? "error-input" : ""}
        />{" "}
        {errors.about && touched.about && (
          <p className="error-msg"> {errors.about} </p>
        )}
        <Input
          type="text"
          label="Phone Number"
          value={values.number}
          onChange={handleChange}
          id="number"
          onBlur={handleBlur}
          className={errors.number && touched.number ? "error-input" : ""}
        />{" "}
        {errors.number && touched.number && (
          <p className="error-msg"> {errors.number} </p>
        )}
        <Input
          type="text"
          label="Address"
          value={values.address}
          onChange={handleChange}
          id="address"
          onBlur={handleBlur}
          className={errors.address && touched.address ? "error-input" : ""}
        />
        {errors.address && touched.address && (
          <p className="error-msg"> {errors.address} </p>
        )}
        <button disabled={!formIsValid} type="submit">
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default AddNewCompany;
