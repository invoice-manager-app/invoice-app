import { forwardRef } from "react";
import classes from "./Input.module.css";
const Input = forwardRef((props, ref) => {
  return (
    <div className={classes.wrapper}>
      <label htmlFor={props.id}> {props.label} </label>
      <input {...props} ref={ref} />
    </div>
  );
});

export default Input;
