import classes from "./Aside.module.css";

const Aside = ({
  basicInfoHandler,
  companyInfoHandler,
  companyInfoBtnClass,
  basicInfoBtnClass,
}) => {
  return (
    <aside className={classes.aside}>
      <ul>
        <li className={basicInfoBtnClass} onClick={basicInfoHandler}>
          Basic Info
        </li>
        <li className={companyInfoBtnClass} onClick={companyInfoHandler}>
          Company
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
