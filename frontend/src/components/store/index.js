import { configureStore } from "@reduxjs/toolkit";
import actionSlice from "./actions";
import uiSlice from "./Ui-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    action: actionSlice.reducer,
  },
});
export default store;
