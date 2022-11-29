import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCompanies = createAsyncThunk(
  "companies/getCompanies",
  async (arg, thunkApi) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/company/", {
        method: "GET",
        headers: {
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

const companySlice = createSlice({
  name: "company",
  initialState: { allCompanies: null, isLoading: false },
  extraReducers: {
    [getCompanies.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getCompanies.fulfilled]: (state, action) => {
      state.allCompanies = action.payload;
      state.isLoading = false;
    },
    [getCompanies.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});
export default companySlice;
