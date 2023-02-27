import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//create invoice
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (arg, ThunkAPI) => {
    try {
      const response = await axios.post(
        `${window.domain}/invoice/`,
        {
          company: arg.slug,
          client_name: arg.invoiceInputs.clientName,
          client_email: arg.invoiceInputs.clientMail,
          client_address: arg.invoiceInputs.clientAddress,
          client_zipcode: arg.invoiceInputs.clientZcode,
          client_city: arg.invoiceInputs.clientCity,
          client_country: arg.invoiceInputs.clientCountry,
          description: arg.invoiceInputs.productionDescription,
          due_after: arg.invoiceInputs.paymentDue,
          items: arg.inputFields,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      if (response.status === 201) {
        ThunkAPI.dispatch(getInvoices(arg.token));
      }
    } catch (err) {
      console.log(err);
    }
  }
);

//get invoice
export const getInvoices = createAsyncThunk(
  "invoice/getInvoice",
  async (arg, thunkApi) => {
    try {
      let domain = `${window.domain}/invoice/list/`;

      if (arg.currentPage > 1) {
        domain = `${window.domain}/invoice/list/?page=${arg.currentPage}`;
      } else {
        domain = `${window.domain}/invoice/list/`;
      }

      const response = await axios.get(`${domain}`, {
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });

      return response.data;
    } catch (err) {}
  }
);

//invoice pagination
// export const getInvoicePagination = createAsyncThunk(
//   "invoice/getInvoicePagination",
//   async (arg, thunkApi) => {
//     try {
//       const response = await axios.get(
//         `${window.domain}/invoice/invoice/list/?page=${arg.currentPage}`,
//         {
//           headers: {
//             Authorization: `Bearer ${arg.token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (err) {}
//   }
// );

//slice create
const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [],
    isLoading: null,
  },
  extraReducers: {
    [getInvoices.pending]: (state, action) => {
      state.invoices = [];
      state.isLoading = true;
    },
    [getInvoices.fulfilled]: (state, action) => {
      state.invoices = action.payload;
      state.isLoading = false;
    },
    [getInvoices.rejected]: (state, action) => {
      state.invoices = [];
      state.isLoading = false;
    },
  },
});

export default invoicesSlice;
