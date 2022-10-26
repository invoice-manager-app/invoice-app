import { Fragment } from "react";
import Input from "../UI/Inputs";
const CreateNewAccount = ({ values, setValues, responseMsg }) => {
  return (
    <Fragment>
      <Input
        type="userName"
        label="User Name"
        id="userName"
        value={values.username}
        onChange={(e) =>
          setValues({
            username: e.target.value,
          })
        }
      />
      {responseMsg && responseMsg.username && (
        <p className="response-text"> {responseMsg.username[0]} </p>
      )}
      <Input
        type="email"
        label="Your Email"
        id="email"
        value={values.email}
        autoComplete="true"
        onChange={(e) =>
          setValues({
            ...values,
            email: e.target.value,
          })
        }
      />
      {responseMsg && responseMsg.email && (
        <p className="response-text"> {responseMsg.email[0]} </p>
      )}
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
      {responseMsg && responseMsg.password && (
        <p className="response-text"> {responseMsg.password[0]} </p>
      )}
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
      {responseMsg && responseMsg.confirm_password && (
        <p className="response-text"> {responseMsg.confirm_password[0]} </p>
      )}
    </Fragment>
  );
};

export default CreateNewAccount;
