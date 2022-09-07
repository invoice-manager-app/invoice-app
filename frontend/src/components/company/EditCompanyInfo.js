import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { invoiceAction } from "../store/actions";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../store/Ui-slice";

const EditComapnyInfo = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companyInfo = useSelector((state) => state.action.companyInfo);
  const exisitngCompany = companyInfo.find((el) => el.id === id);

  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      email: exisitngCompany.email,
      companyName: exisitngCompany.companyName,

      about: exisitngCompany.about,
      number: exisitngCompany.number,
      address: exisitngCompany.address,
    },
    validationSchema: userSchema,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      invoiceAction.editCompanyInfo({
        id: exisitngCompany.id,
        email: values.email,
        companyName: values.companyName,

        about: values.about,
        number: values.number,
        address: values.address,
      })
    );
    dispatch(uiActions.submitEditCompanyInfo());
    //dispatch(uiActions.toggleUser());
    if (
      values.address !== "" &&
      values.email !== "" &&
      values.companyName !== "" &&
      values.about !== "" &&
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
      {/* <Input
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
      )}*/}
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
