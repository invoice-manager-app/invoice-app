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
      console.log(data);
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
    next: null,
    previous: null,
    currentPage: 1,
    count: null,
    isLoading: false,
    data: null,
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
      state.invoice_list = action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    },
    [getInvoicList.pending]: (state, action) => {
      state.isLoading = false;
    },
  },
});
export const getInvoiceListActions = invoiceListSlice.actions;
export default invoiceListSlice;
