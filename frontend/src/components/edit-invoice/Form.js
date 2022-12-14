import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { editInvoice } from "../../store/edit-invoice-slice";
import { getInformation } from "../../store/invoice-information";
import Input from "../UI/Inputs";
import Items from "./Items";
import { token } from "../../helper/token-id";

import classes from "./Form.module.css";
import { BsPlusLg } from "react-icons/bs";

import { uiActions } from "../../store/Ui-slice";

const Form = ({
  id,

  setInputFields,
  items,
}) => {
  const dispatch = useDispatch();
  const editingInovoice = useSelector(
    (state) => state.invoiceInformationRed.invoice
  );
  //response message
  const responseMsg = useSelector((state) => state.ui.responseMsg);

  //date now
  const dateTime = "";
  let dd = editingInovoice.created_at;
  var cleanDate = new Date(dd.replace(/\./g, "/"));

  // console.log(
  //   cleanDate.getDate().toString() +
  //     "/" +
  //     (cleanDate.getMonth() + 1).toString() +
  //     "/" +
  //     cleanDate.getFullYear().toString()
  // );
  // date created
  let created_at = new Date(dd).toISOString().slice(0, 10);
  // today date
  const todayDate = new Date().toISOString().slice(0, 10);
  //set date
  const [dateNow, setDateNow] = useState(todayDate);
  const [invoiceInputs, setInvoiceInputs] = useState({
    streetAddress: "",
    city: "",
    Zcode: "",
    country: "",
    client_name: editingInovoice.client_name,
    clientMail: "",
    address: "",
    clientCity: "",
    client_zipcode: "",
    description: "",
    due_after: "",
  });

  //add new item
  const handleAddFields = () => {
    setInputFields([
      ...items,
      {
        title: "",
        quantity: "",
        unit_price: "",
        tax_rate: "",
      },
    ]);
  };

  //date handler

  const dateHandler = (e) => {
    let date1 = new Date(e.target.value);
    let date2 = new Date(dateNow);
    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    setDateNow(e.target.value);
    setInvoiceInputs({ ...invoiceInputs, due_after: diffDays });
  };

  //hide form
  const hideFromHandeler = () => {
    dispatch(uiActions.toggleForm());
  };

  const submitHandeler = (e) => {
    e.preventDefault();

    const obj = {
      token,
      id,
      invoiceInputs,
      items: items,
    };

    dispatch(editInvoice(obj));
    dispatch(uiActions.hideForm());
  };
  //form validation
  let form = true;
  if (
    isNaN(invoiceInputs.clientName) &&
    isNaN(invoiceInputs.clientMail) &&
    isNaN(invoiceInputs.clientCity)
  ) {
    form = true;
  }

  let showForm = useSelector((state) => state.ui.formIsVisible);
  let wrapperClass = `${classes.wrapper} ${showForm ? classes.active : ""} `;
  return (
    <div className={wrapperClass}>
      <form className={classes.form} onSubmit={submitHandeler}>
        <h1>Edit Invoice</h1>

        <div>
          <h4>Bill to</h4>

          <Input
            type="text"
            id="client-name"
            label="Client's Name"
            value={invoiceInputs.client_name}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                client_name: e.target.value,
              })
            }
          />
          {responseMsg &&
            responseMsg.client_name &&
            invoiceInputs.client_name === "" && (
              <p className="response-text"> Please Enter The Client Name </p>
            )}
          <Input
            type="text"
            id="client-email"
            label="Client's Email"
            value={invoiceInputs.clientMail}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                clientMail: e.target.value,
              })
            }
          />
          {(!invoiceInputs.clientMail.includes("@") ||
            !invoiceInputs.clientMail.includes(".")) && (
            <p className="response-text"> Please Enter a valid E-mail </p>
          )}
          <Input
            type="text"
            id="client-address"
            label="Street Address"
            value={invoiceInputs.address}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                address: e.target.value,
              })
            }
          />

          <div className={classes.footer}>
            <Input
              type="text"
              id="client-city"
              label="City"
              value={invoiceInputs.clientCity}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  clientCity: e.target.value,
                })
              }
            />

            <Input
              type="text"
              id="c-z-code"
              label="Zip Code"
              value={invoiceInputs.client_zipcode}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  client_zipcode: e.target.value,
                })
              }
            />
            <Input
              type="text"
              id="client-country"
              label="Country"
              value={invoiceInputs.country}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  country: e.target.value,
                })
              }
            />
          </div>
          {responseMsg &&
            responseMsg.client_city &&
            invoiceInputs.clientCity === "" && (
              <p className="response-text"> Please Enter The Client City </p>
            )}
        </div>

        <div>
          <div className={classes.date}>
            <Input
              type="text"
              id="invoice-date"
              label="Invoice Date"
              disabled
              value={created_at}
            />
            <Input
              type="date"
              id="pay-due"
              label="Payment Due"
              value={dateNow}
              onChange={dateHandler}
            />
          </div>

          <Input
            type="text"
            id="p-description"
            label="Production Description"
            value={invoiceInputs.description}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                description: e.target.value,
              })
            }
          />
          <div className={classes.item}>
            <h3>Item List</h3>

            {items.map((inputField, index) => (
              <Items
                key={index}
                index={index}
                inputField={inputField}
                inputFields={items}
                setInputFields={setInputFields}
              />
            ))}

            {responseMsg && responseMsg.items && (
              <p className="response-text"> Please Enter at least one item </p>
            )}
            <button type="button" onClick={handleAddFields}>
              <BsPlusLg /> Add New Item
            </button>
          </div>
        </div>
        <div className={classes.actions}>
          <div>
            <button type="button" onClick={hideFromHandeler}>
              Cancel
            </button>
          </div>
          <div>
            <button type="submit">Edit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
