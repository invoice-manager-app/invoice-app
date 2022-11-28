import { configureStore } from "@reduxjs/toolkit";
import actionSlice from "./actions";
import companySlice from "./company-slice";
import getInvoices from "./get-invoice-detail";
import invoiceListSlice from "./get-invoice-slice";
import paginationSlice from "./pagination-slice";
import searchSlice from "./search-slice";
import uiSlice from "./Ui-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    action: actionSlice.reducer,
    getInvoiceData: getInvoices.reducer,
    companiesReducer: companySlice.reducer,
    invoiceListReducer: invoiceListSlice.reducer,
    paginationReducer: paginationSlice.reducer,
    searchReducer: searchSlice.reducer,
  },
});
export default store;
