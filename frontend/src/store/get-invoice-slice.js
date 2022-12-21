import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getInvoicList = createAsyncThunk(
  "invoice/getInvoiceList",
  async (arg, thunkApi) => {
    try {
      const response = await fetch("http://localhost:8000/invoice/list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const invoiceListSlice = createSlice({
  name: "invoice",
  initialState: {
    invoice_list: null,
  },
  reducers: {
    addInvoices: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [getInvoicList.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getInvoicList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.invoice_list = action.payload;
    },
    [getInvoicList.pending]: (state, action) => {
      state.isLoading = false;
    },
  },
});
export const getInvoiceListActions = invoiceListSlice.actions;
export default invoiceListSlice;
