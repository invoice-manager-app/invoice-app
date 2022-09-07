import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    formIsVisible: false,
    editUser: false,
    editCompany: false,
  },
  reducers: {
    toggleForm(state) {
      state.formIsVisible = !state.formIsVisible;
    },
    toggleUser(state) {
      state.editUser = !state.editUser;
    },
    toggleCompany(state) {
      state.editCompany = !state.editUser;
    },
    editUser(state) {
      state.editUser = true;
    },
    submitUser(state) {
      state.editUser = false;
    },
    editCompanyInfo(state) {
      state.editCompany = true;
    },
    submitEditCompanyInfo(state) {
      state.editCompany = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
