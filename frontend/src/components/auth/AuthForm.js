import { Fragment } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/use-http";
import Notification from "../UI/Notification";
//styles
import classes from "./AuthForm.module.css";
import ForgetPassword from "./ForgetPassword";
import CreateNewAccount from "./CreateNewAccount";
import Login from "./Login";

const AuthForm = () => {
  const notification = useSelector((state) => state.ui.notification);
  console.log(notification);
  const {
    responseMsg,
    httpRequest,
    forgetPassword,
    setForgetPassword,
    passwordChange,
    isLogin,
    toggleHandeler,
    responseArr,
    loginMsg,
    values,
    setValues,
  } = useHttp();

  const submitHandler = async (event) => {
    event.preventDefault();

    await httpRequest(values);
  };

  const forgetPasswordHandeler = () => {
    setForgetPassword((prevState) => !prevState);
  };
  const changePasswordHandler = async (e) => {
    e.preventDefault();
    await passwordChange(values);
  };
  if (forgetPassword) {
    return (
      <Fragment>
        {notification && notification.message !== undefined && <Notification />}
        <ForgetPassword
          values={values}
          changePasswordHandler={changePasswordHandler}
          setValues={setValues}
          responseArr={responseArr}
          forgetPasswordHandeler={forgetPasswordHandeler}
          forgetPassword={forgetPassword}
          notification={notification}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {notification && notification.message !== undefined && <Notification />}
      <section className={classes.form}>
        <h2> {isLogin ? "Login" : "Sign Up"} </h2>
        <form onSubmit={submitHandler}>
          {isLogin && (
            <Login values={values} setValues={setValues} loginMsg={loginMsg} />
          )}
          {!isLogin && (
            <CreateNewAccount
              values={values}
              setValues={setValues}
              responseMsg={responseMsg}
            />
          )}
          {notification && notification.status === "pending" && (
            <p>Loading....</p>
          )}

          {(!notification ||
            (notification && notification.status !== "pending")) && (
            <button type="submit" className={classes.log}>
              {isLogin ? "Sign In" : "Create New Account"}
            </button>
          )}
        </form>

        {(!notification ||
          (notification && notification.status !== "pending")) && (
          <button
            onClick={toggleHandeler}
            type="button"
            className={classes.toggle}
          >
            {isLogin ? "Create New Account" : "Login with exisiting account"}
          </button>
        )}
        <br />
        {isLogin &&
          (!notification ||
            (notification && notification.status !== "pending")) && (
            <button
              onClick={forgetPasswordHandeler}
              type="button"
              className={classes.toggle}
            >
              Forget Password? reset now....
            </button>
          )}
      </section>
    </Fragment>
  );
};
export default AuthForm;
