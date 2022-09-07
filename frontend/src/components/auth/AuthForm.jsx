import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";

import AuthContext from "../../context/auth-context";
import ConfirmationModel from "../UI/ConfirmationModel";
import LoadingSpinner from "../UI/LoadingSpinner";
import Input from "../UI/Inputs";
import classes from "./AuthForm.module.css";
const AuthForm = () => {
  const authCtx = useContext(AuthContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [model, setModel] = useState(null);
  const [modelMsg, setModelMsg] = useState(null);
  const [responseMsg, setResponseMsg] = useState([]);

  const responses = (data) => {
    let resMsg = [];
    if (data && data.email && data.username && !data.response) {
      resMsg.push({
        username: data.username,
        email: data.email,
        password: "",
        confirm_password: "",
      });
      setResponseMsg(resMsg);
    } else if (data && data.username && !data.response) {
      resMsg.push({
        username: data.username,
        email: "",
        password: "",
        confirm_password: "",
      });
      setResponseMsg(resMsg);
    } else if (data && data.email && !data.response) {
      resMsg.push({
        username: "",
        email: data.email,
        password: "",
        confirm_password: "",
      });
      setResponseMsg(resMsg);
    } else if (
      data &&
      (data.email || data.username || data.password || data.confirm_password) &&
      !data.response
    ) {
      resMsg.push({
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });
      setResponseMsg(resMsg);
    } else {
      resMsg = [];
      setResponseMsg(resMsg);
    }
  };
  let responseArr = [];
  const succeedMsg = (data) => {
    if (data && data.response && data.message) {
      responseArr.push({
        response: data.response,
        message: data.message,
      });
      setModelMsg(responseArr);
      setModel(true);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let url, imformation;
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
    }
    setIsloading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify(imformation),
      headers: {
        "Content-type": "Application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`something went wrong ${res.status}`);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setIsloading(false);
        console.log(data);

        let token = data.access;
        if (isLogin) {
          authCtx.login(token, data);
        }
        succeedMsg(data);
        responses(data);
      })
      .catch((err) => {
        responseArr = [err];
        setIsloading(false);
        setModelMsg(responseArr);
        setModel(true);
      });
  };

  const toggleHandeler = () => {
    setIsLogin((prevState) => !prevState);
    setValues({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
  };

  const forgetPasswordHandeler = () => {
    setForgetPassword((prevState) => !prevState);
  };
  const changePasswordHandler = (e) => {
    e.preventDefault();
    let resetPasswordObj = {
      email: values.email,
    };
    if (forgetPassword) {
      fetch("http://127.0.0.1:8000/account/reset-password/", {
        method: "POST",
        body: JSON.stringify(resetPasswordObj),
        headers: {
          "Content-type": "Application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`The username or email is not found ${res.status}`);
          } else {
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
          responseArr.push({
            response: data.non_field_errors[0],
          });
          setIsloading(false);
          setModelMsg(responseArr);
          setModel(true);
        });
    }
  };

  const toggleModel = () => {
    setModel(false);
    console.log("Close");
  };

  if (forgetPassword) {
    return (
      <Fragment>
        {model && (
          <ConfirmationModel responseBack={modelMsg} onClose={toggleModel} />
        )}
        <section className={classes.form}>
          <h2> Forget Password </h2>
          <form>
            <Input type="text" label="Enter Your User-name or E-mail" />

            <button
              type="submit"
              className={classes.log}
              onClick={changePasswordHandler}
            >
              submit
            </button>
          </form>

          <br />
          <button
            onClick={forgetPasswordHandeler}
            type="button"
            className={classes.toggle}
          >
            {forgetPassword ? "Sign In" : "Login with exisiting account"}
          </button>
        </section>
      </Fragment>
    );
  }

  return (
    <React.Fragment>
      {model && (
        <ConfirmationModel responseBack={modelMsg} onClose={toggleModel} />
      )}

      <section className={classes.form}>
        <h2> {isLogin ? "Login" : "Sign Up"} </h2>
        <form onSubmit={submitHandler}>
          {isLogin && (
            <div>
              <Input
                type="email"
                label="Your Email"
                id="email"
                value={values.email}
                onChange={(e) =>
                  setValues({
                    ...values,
                    email: e.target.value,
                  })
                }
              />

              <Input
                type="password"
                label="Your Password"
                id="password"
                value={values.password}
                onChange={(e) =>
                  setValues({
                    ...values,
                    password: e.target.value,
                  })
                }
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <Input
                type="userName"
                label="User Name"
                id="userName"
                value={values.username}
                onChange={(e) =>
                  setValues({
                    ...values,
                    username: e.target.value,
                  })
                }
              />
              {responseMsg.map((el, i) => (
                <p className="exist-info" key={i}>
                  {el.username}{" "}
                </p>
              ))}
              <Input
                type="email"
                label="Your Email"
                id="email"
                value={values.email}
                onChange={(e) =>
                  setValues({
                    ...values,
                    email: e.target.value,
                  })
                }
              />
              {responseMsg.map((el, i) => (
                <p className="exist-info" key={i}>
                  {" "}
                  {el.email}{" "}
                </p>
              ))}

              <Input
                type="password"
                label="Your Password"
                id="password"
                value={values.password}
                onChange={(e) =>
                  setValues({
                    ...values,
                    password: e.target.value,
                  })
                }
              />
              {responseMsg.map((el, i) => (
                <p className="exist-info" key={i}>
                  {el.password}{" "}
                </p>
              ))}
              <Input
                type="password"
                label="Confirm Password"
                id="confirmPassword"
                value={values.confirmPassword}
                onChange={(e) =>
                  setValues({
                    ...values,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {responseMsg.map((el, i) => (
                <p className="exist-info" key={i}>
                  {el.confirm_password}{" "}
                </p>
              ))}
            </div>
          )}
          {isLoading && <p>Loading....</p>}
          {!isLoading && (
            <button type="submit" className={classes.log}>
              {isLogin ? "Sign In" : "Create New Account"}
            </button>
          )}
        </form>

        <button
          onClick={toggleHandeler}
          type="button"
          className={classes.toggle}
        >
          {isLogin ? "Create New Account" : "Login with exisiting account"}
        </button>
        <br />
        {isLogin && (
          <button
            onClick={forgetPasswordHandeler}
            type="button"
            className={classes.toggle}
          >
            Forget Password? reset now....
          </button>
        )}
      </section>
    </React.Fragment>
  );
};
export default AuthForm;
