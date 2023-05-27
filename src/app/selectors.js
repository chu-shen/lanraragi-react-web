/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
import { createSelector } from "reselect";
import { getNumArchivesToRender } from "../storage/archives";
import { firstLetterToUppercase } from "../utils";

const getState = (state) => state;

const getApp = createSelector(getState, (state) => state.app);

export const getCurrentArchiveId = createSelector(
  getApp,
  (app) => `${app.currentArchiveId}`
);

export const getCurrentRandomArchives = createSelector(getApp, (app) => [
  ...app.randomArchives,
]);

export const getCurrentSearchArchives = createSelector(getApp, (app) => [
  ...app.searchArchives,
]);

export const getAmountOfSearchArchives = createSelector(
  getCurrentSearchArchives,
  (archives) => archives.length
);

export const getCurrentArciveRandomArchivesIndex = createSelector(
  getCurrentArchiveId,
  getCurrentRandomArchives,
  (arcId, randomArchives) => {
    const index = randomArchives.findIndex((arc) => arcId === arc.arcid);
    return index === -1 ? 0 : index;
  }
);

export const getCurrentPages = createSelector(getApp, (app) =>
  [...app.pages].map((page) => page.replace(".", ""))
);

export const getCurrentRenderedPages = createSelector(getApp, (app) => [
  ...app.renderedPages,
]);

export const getBaseUrlSelector = createSelector(
  getApp,
  (app) => `${app.baseUrl}`
);

export const getSectionVisibilityObject = createSelector(getApp, (app) => ({
  ...app.sectionVisibility,
}));

export const getSectionVisibilityObjectWithAllFalse = createSelector(
  getSectionVisibilityObject,
  (sectionVisibilityObject) =>
    Object.keys(sectionVisibilityObject).reduce(
      (acc, sec) => ({ ...acc, [sec]: false }),
      {}
    )
);

export const getSectionVisibilityObjectForSideNavbar = createSelector(
  getSectionVisibilityObject,
  (sectionVisibilityObject) => [
    ...Object.keys(sectionVisibilityObject)
      .filter((s) => s !== "address")
      .map((section) => ({
        id: section,
        label: firstLetterToUppercase(section),
        visible: sectionVisibilityObject[section],
      })),
  ]
);

export const shouldScrollToArchive = createSelector(
  getSectionVisibilityObject,
  getCurrentArciveRandomArchivesIndex,
  ({ images, random }, index) => ({
    shouldScroll: images && !random,
    scrollIndex: index,
  })
);

export const getSearchPage = createSelector(
  getApp,
  (app) => app?.searchPage ?? 1
);

export const getSearchFilter = createSelector(
  getApp,
  (app) => app?.searchFilter ?? ""
);

export const getMaxPages = createSelector(
  getAmountOfSearchArchives,
  (numOfArchive) => (breakpoint) => {
    const maxNum = getNumArchivesToRender();
    const maxPageNumber = numOfArchive / maxNum[breakpoint];
    return numOfArchive % maxNum[breakpoint] === 0
      ? maxPageNumber
      : Math.ceil(maxPageNumber);
  }
);

export const getCategories = createSelector(getApp, (app) => [
  ...app.categories,
]);

export const getInfoDialogArchiveId = createSelector(
  getApp,
  (app) => `${app?.infoDialogArchiveId}`
);

export const getArchiveCategories = createSelector(
  getInfoDialogArchiveId,
  getCategories,
  (archiveId, categories) =>
    categories.reduce((acc, category) => {
      const archivesIds = category?.archives;
      if (archivesIds?.length) return acc;
      if (archivesIds?.includes(archiveId)) return { ...acc, category };
      return acc;
    }, {})
);

export const getDisplayNavbar = createSelector(
  getApp,
  (app) => !!app.displayNavbar
);

export const getArchiveOpenedFrom = createSelector(
  getApp,
  (app) => app?.archiveOpenedFrom ?? "random"
);

export const getSearchSort = createSelector(
  getApp,
  (app) => app?.searchSort ?? "date_added"
);

export const getSearchSortDirection = createSelector(
  getApp,
  (app) => app?.searchSortDirection ?? "desc"
);

export const getSearchCategory = createSelector(
  getApp,
  (app) => app?.searchCategory ?? {}
);

export const getLoading = createSelector(getApp, (app) => app?.loading ?? {});

export const getDisplayDeleteSnackbar = createSelector(
  getApp,
  (app) => !!app?.displayDeleteSnackbar
);
