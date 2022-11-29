import { createSlice } from "@reduxjs/toolkit";

const actionSlice = createSlice({
  name: "invoiceAction",
  initialState: {
    value: [],
    userInfo: null,
    filteredInvoices: [],
    length: 0,
    newItem: [],
  },

  reducers: {
    onAddName(state, action) {
      state.value.push({
        id: action.payload.id,
        streetAddress: action.payload.streetAddress,
        city: action.payload.city,
        Zcode: action.payload.Zcode,
        country: action.payload.country,
        clientName: action.payload.clientName,
        clientMail: action.payload.clientMail,
        clientAddress: action.payload.clientAddress,
        clientCity: action.payload.clientCity,
        clientZcode: action.payload.clientZcode,
        clientCountry: action.payload.clientCountry,
        productionDescription: action.payload.productionDescription,
        items: action.payload.items,
        isPending: true,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        paymentDue: action.payload.paymentDue,
      });
      state.length++;
    },

    deleteInvoice(state, action) {
      const id = action.payload;
      state.value = state.value.filter((item) => item.id !== id);
      state.length--;
    },

    editInvoice: (state, action) => {
      const {
        id,
        streetAddress,
        city,
        Zcode,
        country,
        clientName,
        clientMail,
        clientAddress,
        clientCity,
        clientZcode,
        clientCountry,
        productionDescription,
        items,
        paymentDue,
      } = action.payload;
      const existingInvoice = state.value.find((invoice) => invoice.id === id);
      state.changed = true;
      if (existingInvoice) {
        existingInvoice.id = id;
        existingInvoice.streetAddress = streetAddress;
        existingInvoice.city = city;
        existingInvoice.Zcode = Zcode;
        existingInvoice.country = country;
        existingInvoice.clientName = clientName;
        existingInvoice.clientMail = clientMail;
        existingInvoice.clientCity = clientCity;
        existingInvoice.clientZcode = clientZcode;
        existingInvoice.clientCountry = clientCountry;
        existingInvoice.clientCountry = clientCountry;
        existingInvoice.productionDescription = productionDescription;
        existingInvoice.clientAddress = clientAddress;
        existingInvoice.items = items;
        existingInvoice.paymentDue = paymentDue;
      }
    },

    editUser: (state, action) => {
      const newUser = action.payload;
      state.userInfo = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        username: newUser.username,
      };
    },

    editCompanyInfo: (state, action) => {
      const { companyName, email, about, id, number, address } = action.payload;
      const exisitingItem = state.companyInfo.find((el) => el.id === id);
      if (exisitingItem) {
        exisitingItem.id = id;
        exisitingItem.companyName = companyName;
        exisitingItem.email = email;
        exisitingItem.about = about;
        exisitingItem.number = number;
        exisitingItem.address = address;
      }
    },
  },
});

export const invoiceAction = actionSlice.actions;

export default actionSlice;
