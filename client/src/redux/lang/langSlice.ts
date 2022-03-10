import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
export interface langState {
  lang: "EN" | "CN";
}

const initialState: langState = {
  lang: "EN",
};

export const langSlice = createSlice({
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
export const { toggleLang } = langSlice.actions;
export const selectLang = (state: RootState) => state.lang;

export default langSlice.reducer;
