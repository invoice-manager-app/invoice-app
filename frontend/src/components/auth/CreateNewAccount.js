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
      {responseMsg.map((el, i) => (
        <p className="exist-info" key={i}>
          {el.username}
        </p>
      ))}
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
      {responseMsg.map((el, i) => (
        <p className="exist-info" key={i}>
          {el.email}
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
    </Fragment>
  );
};

export default CreateNewAccount;
