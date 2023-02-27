import { configureStore } from "@reduxjs/toolkit";
import actionSlice from "./actions";
import companySlice from "./company-slice";

import getInvoices from "./get-invoice-detail";
import invoiceListSlice from "./get-invoice-slice";
import invoiceInformation from "./invoice-information";
import paginationSlice from "./pagination-slice";
import paginationSearch from "./search-pagination-slice";
import searchSlice from "./search-slice";
import uiSlice from "./Ui-slice";
import invoicesSlice from "./invoice-slice";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    authReducer: authSlice.reducer,
    invoiceReducer: invoicesSlice.reducer,
    action: actionSlice.reducer,
    getInvoiceData: getInvoices.reducer,
    companiesReducer: companySlice.reducer,
    invoiceListReducer: invoiceListSlice.reducer,
    paginationReducer: paginationSlice.reducer,
    searchReducer: searchSlice.reducer,
    invoiceInformationRed: invoiceInformation.reducer,
    paginationSearch: paginationSearch.reducer,
  },
});
export default store;
