import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../store";

export interface settingsState {
  lang: "EN" | "CN";
  socket: Socket | undefined;
}

const initialState: settingsState = {
  lang: "EN",
  socket: undefined,
};

export const settingsSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    toggleLang: (state) => {
      if (state.lang === "EN") {
        state.lang = "CN";
      } else {
        state.lang = "EN";
      }
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});
export const { toggleLang, setSocket } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
