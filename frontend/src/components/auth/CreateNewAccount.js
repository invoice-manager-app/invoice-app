import { Fragment } from "react";
import Input from "../UI/Inputs";
const CreateNewAccount = ({ values, setValues, responseMsg, notification }) => {
  return (
    <Fragment>
      <Input
        type="userName"
        id="userName"
        placeholder="User-name"
        value={values.username}
        onChange={(e) =>
          setValues({
            username: e.target.value,
          })
        }
      />
      {responseMsg &&
        responseMsg.username &&
        notification &&
        notification.message === undefined && (
          <p className="response-text"> {responseMsg.username[0]} </p>
        )}
      <Input
        type="email"
        id="email"
        placeholder="Email address"
        value={values.email}
        autoComplete="true"
        onChange={(e) =>
          setValues({
            ...values,
            email: e.target.value,
          })
        }
      />
      {responseMsg &&
        responseMsg.email &&
        notification &&
        notification.message === undefined && (
          <p className="response-text"> {responseMsg.email[0]} </p>
        )}
      <Input
        type="password"
        placeholder="New password"
        id="password"
        value={values.password}
        onChange={(e) =>
          setValues({
            ...values,
            password: e.target.value,
          })
        }
      />
      {responseMsg &&
        responseMsg.password &&
        notification &&
        notification.message === undefined && (
          <p className="response-text"> {responseMsg.password[0]} </p>
        )}
      <Input
        type="password"
        placeholder="Re-enter password"
        id="confirmPassword"
        value={values.confirmPassword}
        onChange={(e) =>
          setValues({
            ...values,
            confirmPassword: e.target.value,
          })
        }
      />
      {responseMsg &&
        responseMsg.confirm_password &&
        notification &&
        notification.message === undefined && (
          <p className="response-text"> {responseMsg.confirm_password[0]} </p>
        )}
    </Fragment>
  );
};

export default CreateNewAccount;
