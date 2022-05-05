import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  checkProfile,
  generateApiToken,
  sendResetPassword,
  signInUser,
  signOutUser,
  signUpUser,
} from "../../apis/auth.api";
import { patchUser } from "../../apis/data.api";
import { socket } from "App";
export interface userState {
  id: string;
  email: string;
  status: "active" | "loading" | "inactive";
  error: string | undefined;
  token: string;
  total_stages: number[];
}

const initialState: userState = {
  id: "invalid",
  email: "invalid",
  status: "inactive",
  error: undefined,
  token: "invalid",
  total_stages: [0, 0, 0],
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

export const signOutUserAsync = createAsyncThunk(
  "user/signOutUser",
  async () => {
    await signOutUser();
  }
);

export const checkProfileAsync = createAsyncThunk(
  "user/checkProfile",
  async () => {
    const user = await checkProfile();
    return user;
  }
);

export const sendResetPasswordAsync = createAsyncThunk(
  "user/passwordReset",
  async (email: string) => {
    const user = await sendResetPassword(email);
    return user;
  }
);

export const generateApiTokenAsync = createAsyncThunk(
  "user/generateApiToken",
  async () => {
    const token = await generateApiToken();
    return token;
  }
);

export const patchUserAsync = createAsyncThunk(
  "user/patchUser",
  async (user: userState) => {
    const newUser = await patchUser(user);
    return newUser;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.status = initialState.status;
      state.error = initialState.error;
      state.email = initialState.email;
      state.id = initialState.id;
      state.token = initialState.token;
      state.total_stages = initialState.total_stages;
    },
  },
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
        state.total_stages = action.payload.total_stages;
        state.error = undefined;
        socket.connect();

        // invoke useEffect in app.tsx
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        state.status = "active";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.total_stages = action.payload.total_stages;
        socket.connect();

        state.error = undefined;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "inactive";
        state.error = action.error.message;
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.status = "inactive";
        state.error = action.error.message;
      })
      .addCase(checkProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkProfileAsync.fulfilled, (state, action) => {
        state.status = "active";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.total_stages = action.payload.total_stages;
        state.error = undefined;
      })
      .addCase(checkProfileAsync.rejected, (state, action) => {
        state = initialState;
      })
      .addCase(sendResetPasswordAsync.fulfilled, (state, action) => {
        state.error = "Already sent an password reset email to your inbox!";
      })
      .addCase(sendResetPasswordAsync.rejected, (state, action) => {
        state.error = "Cannot sent the request, check the email again";
      })
      .addCase(generateApiTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(patchUserAsync.fulfilled, (state, action) => {
        state.status = "active";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.total_stages = action.payload.total_stages;
      });
  },
});

export const { clearUserState } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
