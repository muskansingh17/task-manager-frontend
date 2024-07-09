import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, login } from "../api";
import { toast } from "react-toastify";

const initialState = {
  isAuthenticated: false,
  user: null,
  status: "loading",
};

export const verifyToken = createAsyncThunk(
  "user/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const userResponse = await getUser();
      return userResponse.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("You are logged out");
        window.location.href = "/login";
      } else if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      localStorage.removeItem("authToken");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const loginResponse = await login(credentials);
      localStorage.setItem("authToken", loginResponse.data.data);
      const userReponse = await getUser();
      return userReponse.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("You are logged out");
        window.location.href = "/login";
      } else if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
