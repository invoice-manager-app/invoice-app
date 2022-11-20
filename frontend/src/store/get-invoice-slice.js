import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Async } from "react-async";

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

      if (!response.ok) {
        throw new Error(response.statusText);
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
  initialState: { invoice_list: null, isLoading: false },
  extraReducers: {
    [getInvoicList.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getInvoicList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.invoice_list = action.payload.results;
    },
    [getInvoicList.pending]: (state, action) => {
      state.isLoading = false;
    },
  },
});
export default invoiceListSlice;
