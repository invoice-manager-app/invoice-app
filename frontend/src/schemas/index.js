import * as yup from "yup";

export const userSchema = yup.object().shape({
  username: yup.string().min(2).required("please enter your User Name"),
  first_name: yup.string().min(2).required("please enter your first name"),
  last_name: yup.string().min(2).required("please enter your last name"),

  name: yup.string().min(2).required("please enter your  name"),
  email: yup.string().email().required("please enter your E-mail"),
  companyName: yup.string().required("please enter your company name"),
  owner: yup.string().min(2).required("please enter The owner name"),
  about: yup
    .string()
    .min(10)
    .required("please enter some info about your company"),
  number: yup.number().positive().required("please enter your phone number"),
  address: yup.string().required("please enter company address"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords Not match"),
});
