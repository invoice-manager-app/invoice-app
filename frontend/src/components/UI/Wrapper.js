import classes from "./Wrapper.module.css";
const Wrapper = ({ children }) => {
  return <div className={classes.wrapper}> {children} </div>;
};
export default Wrapper;
