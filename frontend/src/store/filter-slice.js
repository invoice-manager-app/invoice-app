import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let baseUrl = "http://localhost:8000/invoice/list/?ordering=";
export const filterInvoice = createAsyncThunk(
  "filter/invoice",
  async (arg, thunkApi) => {
    try {
      const response = await fetch(baseUrl + `${arg.filter}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
      });

      const data = await response.json();
      // if (data && data.next && arg.number > 1) {
      //   thunkApi.dispatch(invoicePagination(arg));
      // }
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const invoicePagination = createAsyncThunk(
  "filter/invoice",
  async (arg, thunkApi) => {
    try {
      const response = await fetch(
        baseUrl + `${arg.filter}&page=${arg.number}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const dataFiltered = createSlice({
  name: "filter",
  initialState: {
    isLoading: false,
    dataFiltered: null,
  },
  extraReducers: {
    [filterInvoice.pending]: (state) => {
      state.isLoading = true;
    },
    [filterInvoice.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.dataFiltered = action.payload;
    },
    [filterInvoice.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default dataFiltered;
