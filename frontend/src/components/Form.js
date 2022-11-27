import { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { invoiceAction } from "../store/actions";
import { uiActions } from "../store/Ui-slice";
import Input from "./UI/Inputs";
import classes from "./Form.module.css";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { createInvoice } from "../store/action-creator";
import { getInvoicList } from "../store/get-invoice-slice";
import { getPagination } from "../store/pagination-slice";

const Form = () => {
  const dispatch = useDispatch();

  let allCompanies = useSelector((state) => state.getInvoiceData.selectCompany);
  //current page
  const currentPage = useSelector(
    (state) => state.paginationReducer.currentPage
  );
  const responseMsg = useSelector((state) => state.ui.responseMsg);

  const location = useLocation();
  const [companies, setCompanies] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");

  const [dateNow, setDateNow] = useState();
  const [invoiceInputs, setInvoiceInputs] = useState({
    streetAddress: "",
    city: "",
    Zcode: "",
    country: "",
    clientName: "",
    clientMail: "",
    clientAddress: "",
    clientCity: "",
    clientZcode: "",
    clientCountry: "",
    productionDescription: "",
    paymentDue: 11,
  });
  const [inputFields, setInputFields] = useState([
    { title: "", quantity: "", unit_price: "", tax_rate: 10 },
  ]);

  const [dateTime] = useState(new Date());

  const [payTerms, setPayTerms] = useState("--choose an option--");

  //fetch companies
  useEffect(() => {
    setCompanies(allCompanies);
  }, [allCompanies]);

  //hide form on route change
  useEffect(() => {
    dispatch(uiActions.hideForm());
  }, [location, dispatch]);

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
        title: "",
        quantity: "",
        unit_price: "",
        tax_rate: 10,
      },
    ]);
  };

  //select handler change

  const selectHandleChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const submitHandeler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const obj = {
      num: currentPage,
      token,
    };
    dispatch(createInvoice(token, selectedCompany, invoiceInputs, inputFields));
    dispatch(getPagination(obj));

    dispatch(uiActions.hideForm());

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${token} `);
    // myHeaders.append("Content-Type", "application/json");
    // var raw = JSON.stringify({
    //   client_name: "Karamyyy Farhan",
    //   client_email: "karam@gmail.com",
    //   client_number: "+9984737383",
    //   client_address: "Iraq. Baghdad. AL Ola Street 4/3",
    //   client_zipcode: 3433,
    //   client_city: "Baghdad",
    //   client_country: "Iraq",
    //   due_after: 10,
    //   discount_amount: 12,
    //   description: "please pay it in the very soon time",
    //   company: "vodafone",
    //   items: [
    //     {
    //       title: "AX",
    //       quantity: 2,
    //       unit_price: 160,
    //       tax_rate: 10,
    //     },
    //     {
    //       title: "BX",
    //       quantity: 5,
    //       unit_price: 25,
    //       tax_rate: 0,
    //     },
    //   ],
    // });
    // var requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };

    // fetch("http://localhost:8000/invoice/", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));
    // setInputFields([
    //   {
    //     itemName: "",
    //     qty: "",
    //     price: "",
    //     tax_rate: 0,
    //   },
    // ]);

    // setInvoiceInputs({
    //   id: "",
    //   streetAddress: "",
    //   city: "",
    //   Zcode: "",
    //   country: "",
    //   clientName: "",
    //   clientMail: "",
    //   clientAddrees: "",
    //   clientCity: "",
    //   clientZcode: "",
    //   clientCountry: "",
    //   productionDescription: "",
    //   paymentDue: "",
    // });
  };

  let form = false;
  if (
    isNaN(invoiceInputs.clientName) &&
    isNaN(invoiceInputs.clientMail) &&
    isNaN(invoiceInputs.clientCity) &&
    isNaN(selectedCompany)
  ) {
    form = true;
  }
  const removeHandeler = (index) => {
    if (inputFields.length === 1) {
      return;
    }
    const list = [...inputFields];
    list.splice(index, 1);
    setInputFields(list);
  };
  let showForm = useSelector((state) => state.ui.formIsVisible);
  let wrapperClass = `${classes.wrapper} ${showForm ? classes.active : ""} `;
  //actions

  const addInvoiceHandeler = () => {
    // dispatch(
    //   invoiceAction.onAddName({
    //     id: Math.random().toString().substring(6, 12),
    //     streetAddress: invoiceInputs.streetAddress,
    //     city: invoiceInputs.city,
    //     Zcode: invoiceInputs.Zcode,
    //     country: invoiceInputs.country,
    //     clientName: invoiceInputs.clientName,
    //     clientMail: invoiceInputs.clientMail,
    //     clientAddress: invoiceInputs.clientAddress,
    //     clientCity: invoiceInputs.clientCity,
    //     clientZcode: invoiceInputs.clientZcode,
    //     clientCountry: invoiceInputs.clientCountry,
    //     paymentDue: invoiceInputs.paymentDue,
    //     productionDescription: invoiceInputs.productionDescription,
    //     items: inputFields,
    //   })
    // );
    // dispatch(uiActions.toggleForm());
  };
  const hideFromHandeler = () => {
    dispatch(uiActions.toggleForm());
  };

  const loadingState = useSelector((state) => state.getInvoiceData.isLoading);

  return (
    <div className={wrapperClass}>
      <form className={classes.form} onSubmit={submitHandeler}>
        <h1>New Invoice</h1>
        <div className={classes.selectCompany}>
          <h4>Bill From</h4>
          <span className={classes.arrow}></span>
          {loadingState ? (
            <p>loading companies</p>
          ) : (
            <select
              required
              title="companies"
              aria-label="label for the select"
              onChange={selectHandleChange}
              value={selectedCompany}
            >
              <option value="select" hidden>
                --select--
              </option>
              {companies !== null &&
                companies.map((company, i) => {
                  return (
                    <option key={i} value={`${company.name}`}>
                      {company.name}
                    </option>
                  );
                })}
            </select>
          )}
          {responseMsg && responseMsg.company && !isNaN(selectedCompany) && (
            <p className="response-text"> Please Select The company </p>
          )}
        </div>

        <div>
          <h4>Bill to</h4>

          <Input
            type="text"
            id="client-name"
            label="Client's Name"
            required
            value={invoiceInputs.clientName}
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                clientName: e.target.value,
              })
            }
          />
          {responseMsg &&
            responseMsg.client_name &&
            invoiceInputs.clientName === "" && (
              <p className="response-text"> Please Enter The Client Name </p>
            )}
          <Input
            type="text"
            id="client-email"
            label="Client's Email"
            value={invoiceInputs.clientMail}
            required
            onChange={(e) =>
              setInvoiceInputs({
                ...invoiceInputs,
                clientMail: e.target.value,
              })
            }
          />
          {responseMsg &&
            responseMsg.client_email &&
            invoiceInputs.clientMail === "" && (
              <p className="response-text"> Please Enter The Client Email </p>
            )}
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
              required
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
              value={dateTime.toLocaleDateString("en-US", {
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
            <select onChange={dateChangeHandeler} value={payTerms}>
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
            {/* <ul>
              <li>Item Name</li>
              <li>Qty</li>
              <li>Price</li>
              <li>Tax</li>
              <li>Total</li>
            </ul> */}
            {inputFields.map((inputField, index) => (
              <div key={index}>
                <ul>
                  <li>
                    <Input
                      type="text"
                      id="title"
                      label="Item Name"
                      value={inputField.title}
                      required
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      id="quantity"
                      label="Quantity"
                      value={inputField.quantity}
                      min="1"
                      required
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      id="unit_price"
                      label="Price"
                      min="1"
                      required
                      value={inputField.unit_price}
                      onChange={(event) => handleChangeInput(event, index)}
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      id="tax_rate"
                      label="Tax"
                      value={inputField.tax_rate}
                      readOnly
                    />
                  </li>
                  <li>
                    <Input
                      type="number"
                      label="Total"
                      value={+inputField.unit_price * +inputField.quantity}
                      readOnly
                    />
                  </li>

                  <li className={classes.deleteBtn}>
                    <div>
                      <MdDelete onClick={() => removeHandeler(index)} />
                    </div>
                  </li>
                </ul>
              </div>
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
            <button disabled={!form} onClick={addInvoiceHandeler}>
              Create Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(Form);
