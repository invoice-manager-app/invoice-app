import { Fragment, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Notification from "../UI/Notification";
import useHttp from "../../hooks/use-http";
//styles
import classes from "./AuthForm.module.css";
import ForgetPassword from "./ForgetPassword";
import CreateNewAccount from "./CreateNewAccount";
import Login from "./Login";
import AuthContext from "../../context/auth-context";

const AuthForm = () => {
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
  const authCtx = useContext(AuthContext);

  //notification
  const notification = useSelector((state) => state.ui.notification);

  //notification Message
  const { responseMessage } = useHttp();

  //toggle form
  const toggleHandeler = () => {
    setIsLogin((prevState) => !prevState);
    setValues({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      forgetPassword: "",
    });
  };

  //Registration
  const register = async () => {
    setResponseMsg();

    let url, imformation;
    responseMessage("pending", null);
    if (isLogin) {
      url = "http://127.0.0.1:8000/account/login_token/";
      imformation = {
        email: values.email,
        password: values.password,
      };
    } else {
      url = "http://127.0.0.1:8000/account/register/";
      imformation = {
        username: values.username,
        email: values.email,
        password: values.password,
        confirm_password: values.confirmPassword,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(imformation),
          headers: {
            "Content-type": "Application/json",
          },
        });

        const data = await response.json();
        responseMessage("succeed", data.message);
        setResponseMsg(data);
        if (!response.ok) {
          throw new Error(
            data.detail || `something went wrong ${response.status}`
          );
        }
        if (!isLogin && response.status === 200 && data.message) {
          setIsLogin(true);
        }

        let token = data.access;
        if (isLogin) {
          authCtx.login(token, data);
        }
      } catch (error) {
        if (!isLogin) {
          setIsLogin(false);
        }
        responseMessage("error", error.message);
      }
    }
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

  return (
    <Fragment>
      {notification &&
        notification.message !== undefined &&
        notification.message !== null && <Notification />}
      <section className={classes.form}>
        <h2> {isLogin ? "Login" : "Sign Up"} </h2>
        <form onSubmit={submitHandler}>
          {isLogin && <Login values={values} setValues={setValues} />}
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
