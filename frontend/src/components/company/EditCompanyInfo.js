import { useState } from "react";
import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../../store/Ui-slice";
import Avatar from "./Avatar";
import { editCompanyFn } from "../../store/action-creator";

const EditComapnyInfo = ({
  companies,

  getAllCompanies,
}) => {
  const [image, setImage] = useState("");
  const [imgSrc, setImgSrc] = useState(companies.avatar);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }

  let formIsValid = false;
  const { values, errors, handleBlur, touched, handleChange } = useFormik({
    initialValues: {
      email: companies.email,
      companyName: companies.name,
      about: companies.about,
      number: companies.number,
      address: companies.address,
    },
    validationSchema: userSchema,
  });

  //image

  //setbackground function
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  function validFileType(file) {
    return fileTypes.includes(file.type);
  }
  function setBackGround(e) {
    let curFiles = e.target.files;

    for (const file of curFiles) {
      if (validFileType(file)) {
        let backgroundImg = URL.createObjectURL(file);
        setImgSrc(backgroundImg);
      }
    }
  }

  const imageHandleChange = (e) => {
    setImage(e.target.files[0]);

    setBackGround(e);
  };
  //edit company
  const submitEditedCompany = () => {
    dispatch(editCompanyFn(token, values, companies.slug, image));
  };

  const submitEdit = async () => {
    submitEditedCompany();

    navigate("/profile");
    dispatch(uiActions.switchToUserInfo());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await submitEdit();
  };
  if (
    values.address !== "" &&
    !errors.address &&
    values.email !== "" &&
    !errors.email &&
    values.companyName !== "" &&
    !errors.companyName &&
    values.about !== "" &&
    !errors.about &&
    values.number !== "" &&
    !errors.number
  ) {
    formIsValid = true;
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
      <Input
        type="text"
        label="Company Name"
        value={values.companyName}
        onChange={handleChange}
        id="companyName"
        onBlur={handleBlur}
        className={
          errors.companyName && touched.companyName ? "error-input" : ""
        }
      />
      {errors.companyName && touched.companyName && (
        <p className="error-msg"> {errors.companyName} </p>
      )}
      <Input
        type="email"
        label="E-mail"
        value={values.email}
        onChange={handleChange}
        id="email"
        onBlur={handleBlur}
        className={errors.email && touched.email ? "error-input" : ""}
      />{" "}
      {errors.email && touched.email && (
        <p className="error-msg"> {errors.email} </p>
      )}
      <Input
        type="text"
        label="About"
        value={values.about}
        onChange={handleChange}
        id="about"
        onBlur={handleBlur}
        className={errors.about && touched.about ? "error-input" : ""}
      />{" "}
      {errors.about && touched.about && (
        <p className="error-msg"> {errors.about} </p>
      )}
      <Input
        type="text"
        label="Phone Number"
        value={values.number}
        onChange={handleChange}
        id="number"
        onBlur={handleBlur}
        className={errors.number && touched.number ? "error-input" : ""}
      />{" "}
      {errors.number && touched.number && (
        <p className="error-msg"> {errors.number} </p>
      )}
      <Input
        type="text"
        label="Address"
        value={values.address}
        onChange={handleChange}
        id="address"
        onBlur={handleBlur}
        className={errors.address && touched.address ? "error-input" : ""}
      />
      <div className={classes.avatar}>
        <img src={imgSrc} alt="avatar" />
      </div>
      <Avatar imageHandleChange={imageHandleChange} />
      {errors.address && touched.address && (
        <p className="error-msg"> {errors.address} </p>
      )}
      <button disabled={!formIsValid} type="submit">
        Submit Edit
      </button>
    </form>
  );
};

export default EditComapnyInfo;
