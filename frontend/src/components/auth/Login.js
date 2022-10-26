import { Fragment } from "react";
import Input from "../UI/Inputs";
const Login = ({ values, setValues }) => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default Login;
