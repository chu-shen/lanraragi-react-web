import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayNavbar: true,
  currentArchiveId: "",
  randomArchives: [],
  searchArchives: [],
  categories: [],
  baseUrl: "",
  searchFilter: "",
  searchPage: 1,
  pages: [],
  renderedPages: [],
  infoDialogArchiveId: "",
  sectionVisibility: {
    random: true,
    search: false,
    images: false,
    settings: false,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateCurrentArchiveId: (state, action) => {
      state.currentArchiveId = action.payload;
    },
    updateRandomArchives: (state, { payload }) => {
      state.randomArchives = [...payload];
    },
    updateSearchArchives: (state, { payload }) => {
      state.searchArchives = [...payload];
    },
    updateBaseUrl: (state, { payload }) => {
      state.baseUrl = `${payload}`;
    },
    updatePages: (state, { payload }) => {
      state.pages = [...payload];
    },
    updateRenderedPages: (state, { payload }) => {
      state.renderedPages = [...payload];
    },
    updateSectionVisibility: (state, { payload }) => {
      state.sectionVisibility = { ...state.sectionVisibility, ...payload };
    },
    setAllSectionVisibilityFalse: (state) => {
      state.sectionVisibility = {
        ...Object.keys(state.sectionVisibility).reduce(
          (acc, section) => ({ ...acc, [section]: false }),
          {}
        ),
      };
    },
    updateSearchPage: (state, { payload }) => {
      state.searchPage = payload || 1;
    },
    updateSearchFilter: (state, { payload }) => {
      state.searchFilter = payload ?? "";
    },
    updateCategories: (state, { payload }) => {
      state.categories = [...payload];
    },
    updateInfoDialogArchiveId: (state, { payload }) => {
      state.infoDialogArchiveId = payload;
    },
    updateDisplayNavbar: (state, { payload }) => {
      state.displayNavbar = payload;
    },
  },
});

export const {
  updateCurrentArchiveId,
  updateRandomArchives,
  updateBaseUrl,
  updatePages,
  updateRenderedPages,
  updateSectionVisibility,
  updateSearchArchives,
  updateSearchPage,
  updateSearchFilter,
  setAllSectionVisibilityFalse,
  updateCategories,
  updateInfoDialogArchiveId,
  updateDisplayNavbar,
} = appSlice.actions;

export default appSlice.reducer;
