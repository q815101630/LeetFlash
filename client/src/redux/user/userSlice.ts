import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { signInUser, signUpUser } from "../../apis/auth.api";
export interface userState {
  id: string;
  email: string;
  status: "active" | "loading" | "inactive";
  error: string | undefined;
}

const initialState: userState = {
  id: "invalid",
  email: "invalid",
  status: "inactive",
  error: undefined,
};

export const loginUserAsync = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const user = await signInUser(email, password);
    return user;
  }
);

export const signUpUserAsync = createAsyncThunk(
  "user/signUpUser",
  async ({ email, password }: { email: string; password: string }) => {
    const user = await signUpUser(email, password);
    return user;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "active";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.error = undefined;
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        state.status = "active";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.error = undefined;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "inactive";
        state.error = action.error.message;
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.status = "inactive";
        state.error = action.error.message;
      });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
