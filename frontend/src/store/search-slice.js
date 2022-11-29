import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const searchData = createAsyncThunk(
  "search/getSearch",
  async (arg, thunkApi) => {
    try {
      const response = await fetch(
        `http://localhost:8000/invoice/list/?search=${arg.name}`,
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
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: { searchData: null, count: null, isLoading: false },
  extraReducers: {
    [searchData.pending]: (state) => {
      state.isLoading = true;
    },
    [searchData.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchData = action.payload.results;
      state.count = action.payload.count;
    },
    [searchData.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default searchSlice;
