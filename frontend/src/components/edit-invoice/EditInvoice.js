import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { uiActions } from "../../store/Ui-slice";

import { getInformation } from "../../store/invoice-information";
import { editInvoice } from "../../store/edit-invoice-slice";
import Form from "./Form";

const EditInvoice = ({ id }) => {
  const dispatch = useDispatch();

  const editingInovoice = useSelector(
    (state) => state.invoiceInformationRed.invoice
  );
  console.log(editingInovoice.items);

  const [selectedCompany, setSelectedCompany] = useState(
    editingInovoice.company.name
  );

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
    paymentDue: 11,
  });

  const { items } = editingInovoice;

  const [inputFields, setInputFields] = useState(
    items.map(({ id, title, quantity, tax_rate, unit_price }) => ({
      title,
      quantity: parseInt(quantity),
      tax_rate: parseInt(tax_rate),
      unit_price: parseInt(unit_price),
    }))
  );

  console.log(inputFields);

  // Items state

  const [dateTime] = useState(new Date());
  const [payTerms, setPayTerms] = useState("--choose an option--");
  const [dateNow, setDateNow] = useState();

  const editInvoiceHandeler = () => {
    dispatch(uiActions.toggleForm());
  };

  return (
    <Form
      id={id}
      invoiceInputs={invoiceInputs}
      setInvoiceInputs={setInvoiceInputs}
      payTerms={payTerms}
      setPayTerms={setPayTerms}
      setDateNow={setDateNow}
      selectedCompany={selectedCompany}
      setSelectedCompany={setSelectedCompany}
      dateTime={dateTime}
      inputFields={items}
      setInputFields={setInputFields}
      items={inputFields}
    />
  );
};

export default EditInvoice;
