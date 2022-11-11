import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { userSchema } from "../../schemas/index";
import { useDispatch } from "react-redux";
import Input from "../UI/Inputs";

import classes from "./AddNewCompany.module.css";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../../store/Ui-slice";
import Avatar from "./Avatar";
import { editCompanyFn } from "../../store/action-creator";
import checkProperties from "../../util/check-objects-keys";

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

  let emailVar = companies.email,
    companyVar = companies.name,
    //imageVar = imgSrc,
    aboutVar = companies.about,
    numberVar = companies.number,
    addressVar = companies.address;
  if (
    values.address !== addressVar ||
    values.email !== emailVar ||
    values.companyName !== companyVar ||
    image !== "" ||
    values.about !== aboutVar ||
    addressVar !== values.address ||
    values.number !== numberVar
  ) {
    formIsValid = true;
  }

  //edit company
  const submitEditedCompany = () => {
    const updateCompanyObj = {
      companyName: values.companyName,
      email: values.email,
      about: values.about,
      number: values.number,
      address: values.address,
      image: image,
    };

    // console.log(updateCompanyObj.image);
    // console.log(image);

    if (updateCompanyObj.email === emailVar) {
      delete updateCompanyObj.email;
    }
    if (updateCompanyObj.image === imgSrc || updateCompanyObj.image === "") {
      delete updateCompanyObj.image;
    }
    if (updateCompanyObj.companyName === companyVar) {
      delete updateCompanyObj.companyName;
    }
    if (updateCompanyObj.about === aboutVar) {
      delete updateCompanyObj.about;
    }
    if (updateCompanyObj.number === numberVar) {
      delete updateCompanyObj.number;
    }
    if (updateCompanyObj.address === addressVar) {
      delete updateCompanyObj.address;
    }
    // console.log(updateCompanyObj);
    // console.log(Object.keys(updateCompanyObj).length);
    // checkProperties(updateCompanyObj);
    checkProperties(updateCompanyObj);
    dispatch(editCompanyFn(token, updateCompanyObj, companies.slug));
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

  const backHanlder = () => {
    navigate("/profile");
    dispatch(uiActions.switchToUserInfo());
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" className={classes.form}>
      <div className={classes.companyAvatarContainer}>
        <div className={classes.companyAvatar}>
          <img src={imgSrc} alt="logo" />
        </div>
        <Avatar imgSrc={imgSrc} setImage={setImage} setImgSrc={setImgSrc} />
        {errors.address && touched.address && (
          <p className="error-msg"> {errors.address} </p>
        )}
      </div>
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
      <div className={classes.actions}>
        <button type="button" onClick={backHanlder}>
          back
        </button>
        <button disabled={!formIsValid} type="submit">
          Submit Edit
        </button>
      </div>
    </form>
  );
};

export default EditComapnyInfo;
