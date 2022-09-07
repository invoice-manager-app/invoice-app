import { useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewUser.module.css";
import { invoiceAction } from "../store/actions";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../../schemas";
import { uiActions } from "../store/Ui-slice";

const EditUserInfo = ({ id }) => {
  //const editUser = useSelector((state) => state.ui.editUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const UserInfoList = useSelector((state) => state.action.userInfo);
  const editingUser = UserInfoList.find((el) => el.id === id);
  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      userName: editingUser.userName,
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
    },
    validationSchema: userSchema,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      invoiceAction.editUserInfo({
        id: editingUser.id,
        email: values.email,
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
      })
    );

    if (values.email !== "" && values.userName !== "") {
      navigate("/profile");
    }

    //dispatch(uiActions.toggleCompany());
    dispatch(uiActions.toggleUser());
  };
  if (
    values.userName !== "" &&
    !errors.userName &&
    values.email !== "" &&
    !errors.email
  ) {
    formIsValid = true;
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
      <Input
        type="text"
        label="E-mail"
        value={values.email}
        onChange={handleChange}
        id="email"
        onBlur={handleBlur}
        className={errors.email && touched.email ? "error-input" : ""}
      />
      {errors.email && touched.email && (
        <p className="error-msg"> {errors.email} </p>
      )}

      <Input
        type="text"
        label="UserName"
        value={values.userName}
        onChange={handleChange}
        id="userName"
        onBlur={handleBlur}
        className={errors.userName && touched.userName ? "error-input" : ""}
      />
      {errors.userName && touched.userName && (
        <p className="error-msg"> {errors.userName} </p>
      )}

      <Input
        type="text"
        label="First Name"
        value={values.firstName}
        onChange={handleChange}
        id="firstName"
      />

      <Input
        type="text"
        label="Last Name"
        value={values.lastName}
        onChange={handleChange}
        id="lastName"
      />

      <button disabled={!formIsValid} type="submit">
        Submit Edit
      </button>
    </form>
  );
};

export default EditUserInfo;
