import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const editStatus = createAsyncThunk(
  "status/editStatus",
  async (arg, thunkApi) => {
    // console.log(arg);
    try {
      const response = await fetch(`http://localhost:8000/invoice/${arg.id}/`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
        body: JSON.stringify({
          status: arg.status,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      ///  console.log(data);
      return data;
    } catch (error) {}
  }
);

const editSlice = createSlice({
  name: "edit-invoice",
  initialState: { updated: null },
  extraReducers: {
    [editStatus.pending]: (state) => {},
    [editStatus.fulfilled]: (state, action) => {
      //    console.log(action);
    },
    [editStatus.rejected]: (state) => {},
  },
});

export default editSlice;
