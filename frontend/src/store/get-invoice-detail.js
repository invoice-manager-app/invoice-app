import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getInvoiceCompany = createAsyncThunk(
  "invoice/getInvoiceCompany",
  async (arg, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8000/company/list/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const getInvoices = createSlice({
  name: "invoice-details",
  initialState: { selectCompany: null, isLoading: false },
  extraReducers: {
    [getInvoiceCompany.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getInvoiceCompany.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.selectCompany = action.payload;
    },
    [getInvoiceCompany.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export default getInvoices;
