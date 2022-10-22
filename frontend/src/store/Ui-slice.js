import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    switchInfo: false,
    changePassword: false,
    formIsVisible: false,
    editUser: false,
    editCompany: false,
    notification: null,
  },
  reducers: {
    toggleUserInfo: (state) => {
      state.switchInfo = !state.switchInfo;
    },
    switchToCompany: (state) => {
      state.switchInfo = true;
    },
    switchToUserInfo: (state) => {
      state.switchInfo = false;
    },
    togglePassword: (state) => {
      state.changePassword = !state.changePassword;
    },
    toggleForm(state) {
      state.formIsVisible = !state.formIsVisible;
    },
    toggleUser(state) {
      state.editUser = !state.editUser;
    },
    toggleCompany(state) {
      state.editCompany = !state.editCompany;
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
    notification: (state, action) => {
      state.notification = {
        status: action.payload.status,
        message: action.payload.message,
      };
    },
    hideNotification: (state) => {
      state.notification = null;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
