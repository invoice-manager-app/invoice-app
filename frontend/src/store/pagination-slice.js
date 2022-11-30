import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getPagination = createAsyncThunk(
  "pagination/getPagination",
  async (arg, thunkApi) => {
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
      console.log(data);
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
  initialState: {
    isLoading: false,
    pageData: null,
    count: null,
    next: null,
    previous: null,
  },

  extraReducers: {
    [getPagination.pending]: (state, action) => {
      state.isLoading = true;
      //console.log(action);
    },
    [getPagination.fulfilled]: (state, action) => {
      state.pageData = action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.isLoading = false;
    },
    [getPagination.rejected]: (state, action) => {
      state.isLoading = false;
      //console.log(action);
    },
  },
});
export const paginationActions = paginationSlice.actions;
export default paginationSlice;
