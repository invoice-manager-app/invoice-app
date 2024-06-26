import { Fragment } from "react";
import Input from "../UI/Inputs";
import classes from "./AuthForm.module.css";

const ForgetPassword = ({
  values,
  notification,
  forgetPasswordHandeler,
  forgetPassword,
  passwordChange,
  setValues,
  responseMsg,
}) => {
  return (
    <Fragment>
      <section className={classes.form}>
        <h2> Forget Password </h2>
        <form>
          <Input
            type="text"
            label="Enter Your User-name or E-mail"
            value={values.forgetPassword}
            onChange={(e) =>
              setValues({
                ...values,
                forgetPassword: e.target.value,
              })
            }
          />

          {(!notification ||
            (notification && notification.status !== "pending")) && (
            <button
              type="submit"
              className={classes.log}
              onClick={passwordChange}
            >
              submit
            </button>
          )}

          {responseMsg && notification && notification.status !== "succeed" && (
            <p className="response-text"> {Object.values(responseMsg)} </p>
          )}
        </form>

        <br />
        {(!notification ||
          (notification && notification.status !== "pending")) && (
          <button
            onClick={forgetPasswordHandeler}
            type="button"
            className={classes.toggle}
          >
            {forgetPassword ? "Sign In" : "Login with exisiting account"}
          </button>
        )}
      </section>
    </Fragment>
  );
};

export default ForgetPassword;
