import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";


// Unused

export interface settingsState {
  lang: "EN" | "CN";
}

const initialState: settingsState = {
  lang: "EN",
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

  },
});
export const { toggleLang } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
