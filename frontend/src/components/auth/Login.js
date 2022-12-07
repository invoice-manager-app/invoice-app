import { Fragment } from "react";
import Input from "../UI/Inputs";
const Login = ({ values, setValues, responseMsg, notification }) => {
  return (
    <Fragment>
      <Input
        type="email"
        id="email"
        placeholder="Email address"
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
        id="password"
        placeholder="Password"
        value={values.password}
        onChange={(e) =>
          setValues({
            ...values,
            password: e.target.value,
          })
        }
      />
      {responseMsg &&
        responseMsg.detail &&
        notification &&
        notification.status !== "succeed" && (
          <p className="response-text"> {responseMsg.detail} </p>
        )}
    </Fragment>
  );
};

export default Login;
