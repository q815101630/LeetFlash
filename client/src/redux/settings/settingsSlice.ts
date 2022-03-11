import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum DifficultyType {
  ALL = "All",
  HARD = "Hard",
  EASY = "Easy",
  MEDIUM = "Medium",
}

export interface settingsState {
  lang: "EN" | "CN";
  difficultyType: DifficultyType;
}

const initialState: settingsState = {
  lang: "EN",
  difficultyType: DifficultyType.ALL,
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
    setDifficultyType: (state, action) => {
      state.difficultyType = action.payload;
    },
  },
});
export const { toggleLang, setDifficultyType } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
