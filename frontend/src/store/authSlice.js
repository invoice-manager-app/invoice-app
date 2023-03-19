import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Login
export const login = createAsyncThunk(
  "login/token",
  async (arg, { rejectWithValue }) => {
    let url, body;
    if (arg.isLogin === true) {
      url = `${window.domain}/account/login_token/`;
      body = {
        email: arg.email,
        password: arg.password,
      };
    } else if (arg.isLogin === false) {
      url = `${window.domain}/account/register/`;
      body = {
        username: arg.username,
        email: arg.email,
        password: arg.password,
        confirm_password: arg.confirm_password,
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        return rejectWithValue(response.statusText);
      }
      return await response.json();
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

//refresh token
export const updateToken = createAsyncThunk(
  "refresh/token",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${window.domain}/account/token/refresh/`, {
        method: "POST",
        body: JSON.stringify({ refresh: arg }),
        headers: {
          "Content-type": "Application/json",
        },
      });
      if (res.status === 401 || res.status === 400) {
        dispatch(logout());
      }
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return await res.json();
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

//create slice
const authSlice = createSlice({
  name: "login",
  initialState: {
    httpErr: "",
    msg: "",
    user: "",
    token: localStorage.getItem("token") || null,
    refresh: localStorage.getItem("refresh-token") || null,
    isLoading: false,
    isAuth: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refresh-token");
      state.isAuth = false;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      console.log(action.payload);
      if (action.payload.access) {
        state.isLoading = false;
        state.token = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isAuth = true;
        localStorage.setItem("token", action.payload.access);
        localStorage.setItem("refresh-token", action.payload.refresh);
      }
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.httpErr = action.payload;
    },

    [updateToken.fulfilled]: (state, action) => {
      state.token = action.payload.access;
      state.isAuth = true;
      localStorage.setItem("token", action.payload.access);
    },
    [updateToken.rejected]: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh-token");
      state.isAuth = false;
    },
  },
});
export const { addToken, logout } = authSlice.actions;
export default authSlice;
