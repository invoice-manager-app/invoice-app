import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getFilteredSearch = createAsyncThunk(
  "filter/search",
  async (arg, thunkApi) => {
    try {
      const response = await fetch(
        `http://localhost:8000/invoice/list/?search=${arg.name}&ordering=${arg.filter}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {}
  }
);

const filterSearchSlice = createSlice({
  name: "search-filter",
  initialState: { data: null },
  extraReducers: {
    [getFilteredSearch.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});
export default filterSearchSlice;
