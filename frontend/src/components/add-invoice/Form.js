import { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/Ui-slice";
import Input from "../UI/Inputs";
import { BsPlusLg } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { createInvoice } from "../../store/invoice-slice";
import AuthContext from "../../context/auth-context";
import Items from "./Items";
import SelectCompany from "./select-company/SelectCompany";

import classes from "./Form.module.css";

// import { getInvoices } from "../../store/invoice-slice";

const Form = () => {
  let { token } = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();

  const responseMsg = useSelector((state) => state.ui.responseMsg);

  const location = useLocation();
  let currentPageNum = parseInt(sessionStorage.getItem("current-page"));

  const [currentPage, setCurrentPage] = useState(currentPageNum || 1);
  const [selectedCompany, setSelectedCompany] = useState("");
  // today date
  const dateTime = new Date().toISOString().slice(0, 10);
  const [dateNow, setDateNow] = useState(dateTime);
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
    paymentDue: 0,
  });
  const [inputFields, setInputFields] = useState([
    { title: "", quantity: "", unit_price: "", tax_rate: 0 },
  ]);

  // const [payTerms, setPayTerms] = useState("--choose an option--");

  //logout
  //selected Company Slug

  const companySlug = useSelector(
    (state) => state.getInvoiceData.selectCompany
  );

  const slug =
    companySlug && companySlug.find((el) => el.name === selectedCompany);

  //hide form on route change
  useEffect(() => {
    dispatch(uiActions.hideForm());
  }, [location, dispatch]);

  //date handler

  const dateHandler = (e) => {
    let date1 = new Date(e.target.value);
    let date2 = new Date(dateTime);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDateNow(e.target.value);
    setInvoiceInputs({ ...invoiceInputs, paymentDue: diffDays });
  };

  const submitHandeler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(slug);
    const obj = {
      slug: slug.slug,
      token,
      invoiceInputs,
      inputFields,
      currentPage,
    };

    dispatch(createInvoice(obj));

    // dispatch(getInvoicList(token));

    //  dispatch(uiActions.hideForm());
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

  let showForm = useSelector((state) => state.ui.formIsVisible);
  let wrapperClass = `${classes.wrapper} ${showForm ? classes.active : ""} `;
  //actions

  const hideFromHandeler = () => {
    dispatch(uiActions.toggleForm());
  };

  //add items filed
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        title: "",
        quantity: "",
        unit_price: "",
        tax_rate: "",
      },
    ]);
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
            <SelectCompany
              setSelectedCompany={setSelectedCompany}
              selectedCompany={selectedCompany}
            />
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
            required
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
              value={dateTime}
            />
            <Input
              type="date"
              id="pay-due"
              label="Payment Due"
              onChange={dateHandler}
              value={dateNow}
            />
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

            {inputFields.map((inputField, index) => (
              <Items
                key={index}
                index={index}
                inputField={inputField}
                inputFields={inputFields}
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
            <button disabled={!form}>Create Invoice</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(Form);
