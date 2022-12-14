import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const searchPagination = createAsyncThunk(
  "search/getSearch",
  async (arg, thunkApi) => {
    try {
      const response = await fetch(
        `http://localhost:8000/invoice/list/?page=${arg.number}&search=${arg.name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText || "Something Went Wrong!");
      }
      const data = await response.json();
      console.log(data, "data");
      console.log(arg.number, "number");
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);
const paginationSearch = createSlice({
  name: "search-pagination",
  initialState: {
    searchData: null,
    count: null,
    nextBtn: null,
    isLoading: null,
  },

  extraReducers: {
    [searchPagination.pending]: (state) => {
      state.isLoading = true;
    },
    [searchPagination.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchData = action.payload.results;
      state.count = action.payload.count;
      state.nextBtn = action.payload.next;
      console.log(action);
    },
    [searchPagination.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default paginationSearch;
