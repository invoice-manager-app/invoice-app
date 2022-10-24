import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../../store/Ui-slice";

const EditComapnyInfo = ({
  companies,
  submitEditedCompany,
  getAllCompanies,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  // const name = companies.map((el) => el.name).toString();
  // const email = companies.map((el) => el.email).toString();
  // const about = companies.map((el) => el.about).toString();
  // const number = companies.map((el) => el.number).toString();
  // const address = companies.map((el) => el.address).toString();
  // const slug = companies.map((el) => el.slug).toString();

  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      email: companies.email,
      companyName: companies.name,
      about: companies.about,
      number: companies.number,
      address: companies.address,
    },
    validationSchema: userSchema,
  });

  const submitEdit = async () => {
    submitEditedCompany(values, companies.slug);
    await getAllCompanies(token);
    navigate("/profile");
    dispatch(uiActions.switchToCompany());
    console.log("SUB");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await submitEdit();

    // if (
    //   values.address !== "" &&
    //   values.email !== "" &&
    //   values.companyName !== "" &&
    //   values.about !== "" &&
    //   values.number !== ""
    // ) {
    //   navigate("/profile");
    // }
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
        Submit Edit
      </button>
    </form>
  );
};

export default EditComapnyInfo;
