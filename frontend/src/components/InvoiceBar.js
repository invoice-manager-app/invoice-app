import { useSelector } from "react-redux";
import { Fragment, memo } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
const InvoiceBar = ({ filtered }) => {
  let inputFields = useSelector((state) => state.action.value);

  return (
    <Fragment>
      <ul className={classes.categories}>
        <li>ORDER ID</li>
        <li>CREATED</li>
        <li>CUSTOMER</li>
        <li>TOTAL</li>
        <li>STATUS</li>
      </ul>
      {filtered.map((item) => (
        <InvoiceItem
          id={item.id}
          key={item.id}
          name={item.clientName}
          items={item.items}
          date={item.date}
          status={item.isPending}
        />
      ))}
    </Fragment>
  );
};
export default memo(InvoiceBar);
