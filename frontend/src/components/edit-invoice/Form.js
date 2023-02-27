import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editInvoice } from "../../store/edit-invoice-slice";
import Input from "../UI/Inputs";
import Items from "./Items";
import classes from "./Form.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Form = ({ id, setInputFields, items, editingInovoice }) => {
  let { token } = useSelector((state) => state.authReducer);

  const navigate = useNavigate();
  // today date
  const todayDate = new Date().toISOString().slice(0, 10);
  //form validation
  const [isValid, setIsValid] = useState(false);
  //set date
  const [dateNow, setDateNow] = useState(todayDate);

  const {
    client_name,
    client_email,
    client_zipcode,
    description,
    due_after,
    client_country,
    client_address,
    client_city,
  } = editingInovoice;

  const [invoiceInputs, setInvoiceInputs] = useState({
    city: client_city,
    Zcode: client_zipcode,
    country: client_country,
    client_name: client_name,
    clientMail: client_email,
    address: client_address,
    client_zipcode: client_zipcode,
    description,
    due_after: due_after,
  });

  const [information] = items;
  const [invoice_information] = editingInovoice.items;

  //form validation
  useEffect(() => {
    if (
      (invoiceInputs.clientMail.trim() !== "" &&
        invoiceInputs.clientMail.includes("@") &&
        invoiceInputs.clientMail !== client_email) ||
      (invoiceInputs.client_name !== client_name &&
        invoiceInputs.client_name.trim() !== "") ||
      description !== invoiceInputs.description ||
      (client_city !== invoiceInputs.city && invoiceInputs.city !== "") ||
      client_zipcode !== invoiceInputs.Zcode ||
      client_country !== invoiceInputs.country ||
      (client_address !== "" && client_address !== invoiceInputs.address)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    if (dateNow !== todayDate) {
      setIsValid(true);
    }
  }, [
    client_address,
    client_city,
    client_country,
    client_email,
    client_name,
    client_zipcode,
    dateNow,
    description,
    invoiceInputs.Zcode,
    invoiceInputs.address,
    invoiceInputs.city,
    invoiceInputs.clientMail,
    invoiceInputs.client_name,
    invoiceInputs.country,
    invoiceInputs.description,
    todayDate,
  ]);

  //deleted items
  const dispatch = useDispatch();

  //response message
  const responseMsg = useSelector((state) => state.ui.responseMsg);

  //date created at

  let created_at = editingInovoice.created_at;

  let date_created = new Date(
    created_at.substr(3, 2) +
      "/" +
      created_at.substr(0, 2) +
      "/" +
      created_at.substr(6, 4)
  );

  //add new item
  const handleAddFields = () => {
    setInputFields([
      ...items,
      { title: "", quantity: "", unit_price: "", tax_rate: "" },
    ]);
  };

  //date handler

  const dateHandler = (e) => {
    // payment due
    let date1 = new Date(e.target.value);
    // date created
    let date2 = date_created;
    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDateNow(e.target.value);
    setInvoiceInputs({ ...invoiceInputs, due_after: diffDays });
  };

  //hide form
  const hideFromHandeler = () => {
    navigate(-1);
  };

  function solve(myList1, myList2) {
    for (let i = 0; i < myList1.length; i++) {
      const obj1 = myList1[i];
      const obj2 = myList2[i];
      for (let key in obj2) {
        if (key !== "id") {
          if (obj2.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
            if (
              obj1[key] === obj2[key] ||
              parseInt(obj1[key]) === parseInt(obj2[key])
            ) {
              delete obj1[key];
            }
          }
        }
      }
    }
  }

  // On Submit
  const submitHandeler = (e) => {
    e.preventDefault();

    for (let key in invoiceInputs) {
      for (let key2 in editingInovoice) {
        if (invoiceInputs[key] === editingInovoice[key2])
          delete invoiceInputs[key];
      }
    }

    const filteredArr = items.filter(
      (value) => Object.keys(value).length !== 0
    );
    // FILTER ARRAY
    solve(filteredArr, editingInovoice.items);

    let obj = {
      token,
      id,
      invoiceInputs,
      items: filteredArr,
    };
    obj.items.map((el) => {
      if (Object.keys(el).length === 1 && el.id) {
        delete el.id;
      }
    });

    const done = obj.items.filter(
      (obj) => !(obj && Object.keys(obj).length === 0)
    );

    obj.items = done;
    if (obj.items.length === 0) {
      delete obj.items;
    }

    console.log(obj.items);
    console.log(editingInovoice.items);

    dispatch(editInvoice(obj));
    navigate(-1);
  };

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
          {/* {(!invoiceInputs.clientMail.includes("@") ||
            !invoiceInputs.clientMail.includes(".")) && (
            <p className="response-text"> Please Enter a valid E-mail </p>
          )} */}
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
              value={invoiceInputs.city}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  city: e.target.value,
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
          <div>
            <h3>Item List</h3>

            {items.map((inputField, index) => (
              <Items
                key={index}
                editingInovoice={editingInovoice}
                index={index}
                inputField={inputField}
                inputFields={items}
                setInputFields={setInputFields}
                setIsValid={setIsValid}
              />
            ))}

            {responseMsg && responseMsg.items && (
              <p className="response-text"> Please Enter at least one item </p>
            )}
            <button
              className={classes.addItem}
              type="button"
              onClick={handleAddFields}
            >
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
            <button disabled={!isValid} type="submit">
              Edit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
