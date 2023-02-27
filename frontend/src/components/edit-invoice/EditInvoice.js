import { useState } from "react";
import { useSelector } from "react-redux";

import Form from "./Form";

const EditInvoice = ({ id }) => {
  const editingInovoice = useSelector(
    (state) => state.invoiceInformationRed.invoice
  );

  const { items } = editingInovoice;

  const [inputFields, setInputFields] = useState(
    items.map(({ id, title, quantity, tax_rate, unit_price }) => ({
      id: id,
      title,
      quantity: parseInt(quantity),
      tax_rate: parseInt(tax_rate),
      unit_price: parseInt(unit_price),
    }))
  );

  // Items state

  // const editInvoiceHandeler = () => {
  //   dispatch(uiActions.toggleForm());
  // };

  return (
    <Form
      id={id}
      setInputFields={setInputFields}
      items={inputFields}
      editingInovoice={editingInovoice}
    />
  );
};

export default EditInvoice;
