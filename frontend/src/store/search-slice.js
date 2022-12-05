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
  initialState: { searchData: null, count: null, isLoading: null },
  reducers: {
    emptySearchArray: (state, action) => {
      state.searchData = null;
    },
  },
  extraReducers: {
    [searchData.pending]: (state) => {
      state.isLoading = true;
      state.searchData = null;
    },
    [searchData.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchData = action.payload.results;
      state.count = action.payload.count;
      console.log(state.searchData);
    },
    [searchData.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const searchAction = searchSlice.actions;

export default searchSlice;
