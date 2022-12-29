import { Fragment, memo } from "react";
import InvoiceItem from "./InvoiceItem";
import classes from "./InvoiceBar.module.css";

import LoadingSpinner from "./UI/LoadingSpinner";

const InvoiceBar = ({ invoices, isLoading }) => {
  return (
    <Fragment>
      <ul className={classes.categories}>
        <li>ORDER ID</li>
        <li>CREATED</li>
        <li>CUSTOMER</li>
        <li>TOTAL</li>
        <li>STATUS</li>
      </ul>
      <div className={classes.invoiceList}>
        {invoices.map((item) => {
          return (
            <InvoiceItem
              key={item.invoice_code}
              id={item.invoice_code}
              name={item.client_name}
              items={item.items}
              date={item.created_at}
              status={item.status}
              net_amount={item.get_net_amount}
            />
          );
        })}
      </div>
      {isLoading && <LoadingSpinner />}
    </Fragment>
  );
};
export default memo(InvoiceBar);
