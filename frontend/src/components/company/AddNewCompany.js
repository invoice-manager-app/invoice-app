import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { invoiceAction } from "../store/actions";
import { useNavigate } from "react-router-dom";

const AddNewCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    dispatch(
      invoiceAction.createCompany({
        id: Math.random().toString(),
        email: values.email,
        companyName: values.companyName,
        owner: values.owner,
        about: values.about,
        number: values.number,
        address: values.address,
      })
    );

    if (
      values.address !== "" &&
      values.email !== "" &&
      values.companyName !== "" &&
      values.about !== "" &&
      values.owner !== "" &&
      values.number !== ""
    ) {
      navigate("/profile");
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
    values.owner !== "" &&
    !errors.owner &&
    values.number !== "" &&
    !errors.number
  ) {
    formIsValid = true;
  }

  return (
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
        type="text"
        label="Owner"
        value={values.owner}
        onChange={handleChange}
        id="owner"
        onBlur={handleBlur}
        className={errors.owner && touched.owner ? "error-input" : ""}
      />{" "}
      {errors.owner && touched.owner && (
        <p className="error-msg"> {errors.owner} </p>
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
  );
};

export default AddNewCompany;
