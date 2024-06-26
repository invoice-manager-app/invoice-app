import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../UI/Notification";
import useHttp from "../../hooks/use-http";
//styles
import classes from "./AuthForm.module.css";
import ForgetPassword from "./ForgetPassword";
import CreateNewAccount from "./CreateNewAccount";
import Login from "./Login";
import { login } from "../../store/authSlice";

const AuthForm = () => {
  const dispatch = useDispatch();
  //form value
  const [values, setValues] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    forgetPassword: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [responseMsg, setResponseMsg] = useState([]);
  const [forgetPassword, setForgetPassword] = useState(false);

  //auth context

  //notification
  const notification = useSelector((state) => state.ui.notification);

  //notification Message
  const { responseMessage } = useHttp();

  //toggle form
  const resetHandler = () => {
    setValues({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      forgetPassword: "",
    });
    setResponseMsg([]);
  };

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
    resetHandler();
  };
  //Registration
  const register = () => {
    const obj = {
      username: values.username,
      email: values.email,
      password: values.password,
      confirm_password: values.confirmPassword,
      isLogin,
    };
    dispatch(login(obj));
  };

  //change password
  const passwordChange = async () => {
    setResponseMsg();
    let resetPasswordObj = {
      username: values.forgetPassword,
    };
    if (resetPasswordObj.username.includes("@")) {
      resetPasswordObj = {
        email: values.forgetPassword,
      };
    }
    if (forgetPassword) {
      responseMessage("pending", "wait.....");
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/account/reset-password/",
          {
            method: "POST",
            body: JSON.stringify(resetPasswordObj),
            headers: {
              "Content-type": "Application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `The username or email is not found ${response.status}`
          );
        }
        const data = await response.json();
        responseMessage("succeed", data.response);

        setResponseMsg(data);
        if (data && data.non_field_errors) {
          responseMessage("error", null);
        }
      } catch (error) {
        responseMessage("error", null);
      }
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    await register();
  };

  const forgetPasswordHandeler = () => {
    setForgetPassword((prevState) => !prevState);
    setResponseMsg([]);
  };
  const changePasswordHandler = async (e) => {
    e.preventDefault();
    //await passwordChange(values);
  };
  if (forgetPassword) {
    return (
      <Fragment>
        {notification &&
          notification.message !== undefined &&
          notification.message !== null && <Notification />}
        <ForgetPassword
          values={values}
          changePasswordHandler={changePasswordHandler}
          setValues={setValues}
          forgetPasswordHandeler={forgetPasswordHandeler}
          forgetPassword={forgetPassword}
          notification={notification}
          passwordChange={passwordChange}
          responseMsg={responseMsg}
        />
      </Fragment>
    );
  }

  const loginAcitveBtn = isLogin ? classes.activeBtn : "";
  const signupAcitveBtn = !isLogin ? classes.activeBtn : "";

  const logBtn = isLogin ? classes.loginBtn : classes.signup;
  const toggleBtn = isLogin ? classes.signupBtn : classes.signinBtn;
  return (
    <Fragment>
      {notification &&
        notification.message !== undefined &&
        notification.message !== null && <Notification />}
      <section className={classes.form}>
        <h2> {isLogin ? "Log in" : "Sign Up"} </h2>
        <form onSubmit={submitHandler}>
          {isLogin && (
            <Login
              values={values}
              setValues={setValues}
              responseMsg={responseMsg}
              notification={notification}
            />
          )}
          {!isLogin && (
            <CreateNewAccount
              values={values}
              setValues={setValues}
              responseMsg={responseMsg}
              notification={notification}
            />
          )}
          {notification && notification.status === "pending" && (
            <p>Loading....</p>
          )}

          {(!notification ||
            (notification && notification.status !== "pending")) && (
            <button type="submit" className={logBtn}>
              {isLogin ? "Log in" : "Sign Up"}
            </button>
          )}
        </form>

        <br />
        {isLogin &&
          (!notification ||
            (notification && notification.status !== "pending")) && (
            <button
              onClick={forgetPasswordHandeler}
              type="button"
              className={classes.toggle}
            >
              Forget Password?
            </button>
          )}

        {isLogin && <div className={classes.separator}>or</div>}
        {(!notification ||
          (notification && notification.status !== "pending")) && (
          <div className={classes.sign}>
            <button className={toggleBtn} onClick={toggleForm} type="button">
              {!isLogin ? "Already have an account ? " : "Create New Account"}
            </button>
          </div>
        )}
      </section>
    </Fragment>
  );
};
export default AuthForm;
