import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getInformation = createAsyncThunk(
  "getInformation/invoice",
  async (arg, { dispatch, getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/invoice/${arg.id}/`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const invoiceInformation = createSlice({
  name: "invoice-information",
  initialState: { invoice: null, isLoading: false },
  extraReducers: {
    [getInformation.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getInformation.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.invoice = action.payload;
    },
    [getInformation.rejected]: (state, action) => {
      state.isLoading = null;
    },
  },
});
export default invoiceInformation;
