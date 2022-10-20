import { useState, useContext } from "react";
import { uiActions } from "../store/Ui-slice";
import { useDispatch } from "react-redux";
import AuthContext from "../context/auth-context";

const useHttp = () => {
  const authCtx = useContext(AuthContext);
  const dispatchRedux = useDispatch();

  //states
  const [isLogin, setIsLogin] = useState(true);
  const [responseMsg, setResponseMsg] = useState([]);
  const [forgetPassword, setForgetPassword] = useState(false);

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

  const responseMessage = (status, message) => {
    dispatchRedux(
      uiActions.notification({
        status: status,
        message: message,
      })
    );
  };

  const httpRequest = async (values) => {
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
    responseMessage("pending", "wait....");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(imformation),
        headers: {
          "Content-type": "Application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`something went wrong ${response.status}`);
      }

      const data = await response.json();
      responseMessage("succeed", data.message);
      let token = data.access;
      if (isLogin) {
        authCtx.login(token, data);
      }
      responses(data);
    } catch (error) {
      responseMessage("error", "Something went wrong");
    }
  };

  const passwordChange = async (values) => {
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
        if (data && data.non_field_errors) {
          responseMessage("error", data.non_field_errors);
        }
      } catch (error) {
        responseMessage("error", "Something went wrong");
      }
    }
  };

  const toggleHandeler = () => {
    setIsLogin((prevState) => !prevState);
  };
  return {
    responses,
    responseMsg,
    httpRequest,
    passwordChange,
    setForgetPassword,
    forgetPassword,
    setIsLogin,
    isLogin,
    responseMessage,
    toggleHandeler,
  };
};
export default useHttp;
