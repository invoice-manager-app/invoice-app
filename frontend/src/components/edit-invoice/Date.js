import classes from "./Date.module.css";

const Date = ({
  setDateNow,
  payTerms,
  setPayTerms,
  invoiceInputs,
  setInvoiceInputs,
}) => {
  const dateChangeHandeler = (e) => {
    setPayTerms(e.target.value);
    let dateWillUpdate = new Date();

    if (e.target.value === "Net 30 Days") {
      dateWillUpdate.setDate(dateWillUpdate.getDate() + 30);
      setDateNow(
        dateWillUpdate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } else if (e.target.value === "Net 60 Days") {
      dateWillUpdate.setDate(dateWillUpdate.getDate() + 60);

      setDateNow(
        dateWillUpdate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
    return setInvoiceInputs({
      ...invoiceInputs,
      paymentDue: dateWillUpdate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  };

  return (
    <div className={classes.payment_terms}>
      <label>Payment Terms</label>
      <select onChange={dateChangeHandeler} value={payTerms}>
        <option value="--choose an option--">--choose an option--</option>
        <option value="Net 30 Days">Net 30 Days</option>
        <option value="Net 60 Days">Net 60 Days</option>
      </select>
    </div>
  );
};

export default Date;
