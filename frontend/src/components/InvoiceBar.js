import { useSelector } from "react-redux";
import { Fragment, memo } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";
const InvoiceBar = ({ invoiceList }) => {
  if (invoiceList === null) return;
  return (
    <Fragment>
      <ul className={classes.categories}>
        <li>ORDER ID</li>
        <li>CREATED</li>
        <li>CUSTOMER</li>
        <li>TOTAL</li>
        <li>STATUS</li>
      </ul>
      {invoiceList.map((item) => (
        <InvoiceItem
          id={item.invoice_code}
          key={item.invoice_code}
          name={item.client_name}
          items={item.items}
          date={item.created_at}
          status={item.status}
        />
      ))}
    </Fragment>
  );
};
export default memo(InvoiceBar);
