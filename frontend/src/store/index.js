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

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
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
