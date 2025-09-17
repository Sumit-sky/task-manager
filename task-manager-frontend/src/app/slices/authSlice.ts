// src/app/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  type RegisterSchema,
  type LoginSchema,
} from "../../utils/validationSchemas";

// Define the async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterSchema, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: LoginSchema, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface AuthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  status: "idle",
  error: null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message || "Registration failed";
      })
      // login cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.token = null;
        state.error = (action.payload as any)?.message || "Login failed";
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
