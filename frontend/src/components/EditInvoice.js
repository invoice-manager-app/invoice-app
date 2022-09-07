import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { invoiceAction } from "./store/actions";
import { uiActions } from "./store/Ui-slice";
import Input from "./UI/Inputs";
import classes from "./Form.module.css";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

// const options = [
//   { value: "", text: "--choose an option--" },
//   { value: "Net 30 Days", text: "Net 30 Days" },
//   { value: "Net 60 Days", text: "Net 60 Days" },
// ];

const EditInvoice = ({ id }) => {
  const invoiceList = useSelector((state) => state.action.value);
  const editingInovoice = invoiceList.find((invoice) => invoice.id === id);

  const [invoiceInputs, setInvoiceInputs] = useState({
    streetAddress: editingInovoice.streetAddress,
    city: editingInovoice.city,
    Zcode: editingInovoice.Zcode,
    country: editingInovoice.country,
    clientName: editingInovoice.clientName,
    clientMail: editingInovoice.clientMail,
    clientAddress: editingInovoice.clientAddress,
    clientCity: editingInovoice.clientCity,
    clientZcode: editingInovoice.clientZcode,
    clientCountry: editingInovoice.clientCountry,
    productionDescription: editingInovoice.productionDescription,
    paymentDue: editingInovoice.paymentDue,
  });

  const [inputFields, setInputFields] = useState(
    editingInovoice.items.map(({ itemName, qty, price }) => ({
      itemName,
      qty,
      price,
    }))
  );

  const [dateTime] = useState(new Date());
  const [paymentDue, setPaymentDue] = useState("--choose an option--");
  const [dateNow, setDateNow] = useState();

  const dateChangeHandeler = (e) => {
    setPaymentDue(e.target.value);
    let dateWillUpdate = new Date();

    if (e.target.value === "Net 30 Days") {
      dateWillUpdate.setDate(dateWillUpdate.getDate() + 30);
      setDateNow(
        dateWillUpdate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } else if (e.target.value === "Net 60 Days") {
      dateWillUpdate.setDate(dateWillUpdate.getDate() + 60);

      setDateNow(
        dateWillUpdate.toLocaleDateString("en-US", {
          weekday: "long",
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

  const handleChangeInput = (e, index) => {
    const { id, value } = e.target;
    const list = [...inputFields];
    list[index][id] = value;
    setInputFields(list);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        itemName: "",
        qty: "",
        price: "",
      },
    ]);
  };

  const submitHandeler = (e) => {
    e.preventDefault();
  };

  const removeHandeler = (index) => {
    const list = [...inputFields];
    list.splice(index, 1);
    setInputFields(list);
  };
  const dispatch = useDispatch();
  let showForm = useSelector((state) => state.ui.formIsVisible);
  let wrapperClass = `${classes.wrapper} ${showForm ? classes.active : ""} `;
  //actions

  const editInvoiceHandeler = () => {
    dispatch(
      invoiceAction.editInvoice({
        id: editingInovoice.id,
        streetAddress: invoiceInputs.streetAddress,
        city: invoiceInputs.city,
        Zcode: invoiceInputs.Zcode,
        country: invoiceInputs.country,
        clientName: invoiceInputs.clientName,
        clientMail: invoiceInputs.clientMail,
        clientAddress: invoiceInputs.clientAddress,
        clientCity: invoiceInputs.clientCity,
        clientZcode: invoiceInputs.clientZcode,
        clientCountry: invoiceInputs.clientCountry,
        productionDescription: invoiceInputs.productionDescription,
        paymentDue: invoiceInputs.paymentDue,
        items: inputFields,
      })
    );
    dispatch(uiActions.toggleForm());
  };
  const hideFromHandeler = () => {
    dispatch(uiActions.toggleForm());
  };

  return (
    <section className={wrapperClass}>
      <form className={classes.form} onSubmit={submitHandeler}>
        <h1>New Invoice</h1>
        <div>
          <h4>Bill From</h4>

          <Input
            type="text"
            id="street-address"
            label="Street Address"
            value={invoiceInputs.streetAddress}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                streetAddress: e.target.value,
              })
            }
          />
          <div className={classes.footer}>
            <Input
              type="text"
              id="city"
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
              id="z-code"
              label="Zip Code"
              value={invoiceInputs.Zcode}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  Zcode: e.target.value,
                })
              }
            />
            <Input
              type="text"
              id="Country"
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
        </div>

        <div>
          <h4>Bill to</h4>

          <Input
            type="text"
            id="client-name"
            label="Client's Name"
            value={invoiceInputs.clientName}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                clientName: e.target.value,
              })
            }
          />
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
          <Input
            type="text"
            id="client-address"
            label="Street Address"
            value={invoiceInputs.clientAddress}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                clientAddress: e.target.value,
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
              value={invoiceInputs.clientZcode}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  clientZcode: e.target.value,
                })
              }
            />
            <Input
              type="text"
              id="client-country"
              label="Country"
              value={invoiceInputs.clientCountry}
              onChange={(e) =>
                setInvoiceInputs({
                  ...invoiceInputs,
                  clientCountry: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <div className={classes.date}>
            <Input
              type="text"
              id="invoice-date"
              label="Invoice Date"
              disabled
              value={dateTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <Input
              type="text"
              id="pay-due"
              label="Payment Due"
              readOnly
              value={invoiceInputs.paymentDue}
            />
          </div>

          <div className={classes.payment_terms}>
            <label>Payment Terms</label>
            <select onChange={dateChangeHandeler} value={paymentDue}>
              <option value="--choose an option--">--choose an option--</option>
              <option value="Net 30 Days">Net 30 Days</option>
              <option value="Net 60 Days">Net 60 Days</option>
            </select>
          </div>
          <Input
            type="text"
            id="p-description"
            label="Production Description"
            value={invoiceInputs.productionDescription}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                productionDescription: e.target.value,
              })
            }
          />
          <div className={classes.item}>
            <h3>Item List</h3>
            <ul>
              <li>Item Name</li>
              <li>Qty</li>
              <li>Price</li>
              <li>Total</li>
            </ul>
            {inputFields.map((inputField, index) => (
              <div key={index}>
                <ul>
                  <li>
                    <Input
                      type="text"
                      id="itemName"
                      value={inputField.itemName}
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      id="qty"
                      value={inputField.qty}
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      id="price"
                      value={inputField.price}
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>{inputField.price * inputField.qty}</li>
                  <li>
                    <MdDelete onClick={() => removeHandeler(index)} />
                  </li>
                </ul>
              </div>
            ))}

            <button type="button" onClick={handleAddFields}>
              <BsPlusLg /> Add New Item
            </button>
          </div>
        </div>
        <div className={classes.actions}>
          <div>
            <button onClick={hideFromHandeler}>Cancel</button>
          </div>
          <div>
            <button>Save Draft</button>
            <button onClick={editInvoiceHandeler}>Edit Invoice</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditInvoice;
