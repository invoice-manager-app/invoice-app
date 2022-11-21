import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getPagination = createAsyncThunk(
  "pagination/getPagination",
  async (arg, pageNum) => {
    try {
      const response = await fetch(
        `http://localhost:8000/invoice/list/?page=${arg.num}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      // console.log(arg);
      const data = await response.json();
      //  console.log(data);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const paginationSlice = createSlice({
  name: "pagination",
  initialState: { isLoading: false, pageData: [] },
  extraReducers: {
    [getPagination.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getPagination.fulfilled]: (state, action) => {
      state.pageData.push(action.payload.results);
      state.isLoading = false;
    },
    [getPagination.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});
export default paginationSlice;
