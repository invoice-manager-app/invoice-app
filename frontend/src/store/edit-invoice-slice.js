import { createAsyncThunk } from "@reduxjs/toolkit";
import getInvoices from "./get-invoice-detail";

// Edit Status
export const editStatus = createAsyncThunk(
  "status/editStatus",
  async (arg, ThunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/invoice/${arg.id}/`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
        body: JSON.stringify({
          status: arg.status,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.ok) {
        ThunkAPI.dispatch(getInvoices({ token: arg.token, currentPage: 1 }));
      }
      const data = await response.json();
      return data;
    } catch (error) {}
  }
);

//Delete

//Update

//Edit Invoice
export const editInvoice = createAsyncThunk(
  "edit/invoice",
  async (arg, { dispatch, getState, rejectWithValue, fulfillWithValue }) => {
    try {
      let invoice_data = {
        client_name: arg.invoiceInputs.client_name,
        client_email: arg.invoiceInputs.clientMail,
        client_number: arg.invoiceInputs.clientNumber,
        client_address: arg.invoiceInputs.address,
        client_zipcode: arg.invoiceInputs.client_zipcode,
        client_city: arg.invoiceInputs.clientCity,
        client_country: arg.invoiceInputs.country,
        due_after: arg.invoiceInputs.due_after,
        discount_amount: arg.invoiceInputs.discount_amount,
        description: arg.invoiceInputs.description,
        items: arg.items,
      };
      Object.keys(invoice_data).forEach((key) =>
        invoice_data[key] === "" ? delete invoice_data[key] : ""
      );

      const response = await fetch(`http://localhost:8000/invoice/${arg.id}/`, {
        method: "PUT",
        body: JSON.stringify(invoice_data),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Something went wrong");
      }

      const data = await response.json();
      if (response.ok) {
        return dispatch(getInvoices({ token: arg.token, currentPage: 1 }));
      }
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
