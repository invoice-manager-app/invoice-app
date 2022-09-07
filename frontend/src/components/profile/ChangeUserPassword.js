import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Input from "../UI/Inputs";
import classes from "./ChangePassword.module.css";
//import { ChangePassword } from "../../schemas/changepassword";

const ChangeUserPassword = () => {
  const navigate = useNavigate();

  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

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
          errors.currentPassword && touched.currentPassword ? "error-input" : ""
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
      <button disabled={!formIsValid} type="submit">
        Change Password
      </button>
    </form>
  );
};

export default ChangeUserPassword;
