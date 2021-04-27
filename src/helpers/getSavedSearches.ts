import { SAVED_SEARCHES } from "../const";

function getSavedSearches() {
  if (localStorage.getItem(SAVED_SEARCHES)) {
    return JSON.parse(localStorage.getItem(SAVED_SEARCHES) || "");
  }

  return null;
}

export function setSavedSearches(searches: any[]) {
  return localStorage.setItem(SAVED_SEARCHES, JSON.stringify(searches));
}

export function removeSavedSearch(search: any) {
  const currentSavedSearches = getSavedSearches() || [];

  const updatedSavedSearches = currentSavedSearches.filter(
    (s) =>
      s.title !== search.title ||
      s.search.keyword !== search.search.keyword ||
      s.search.filter !== search.search.filter
  );

  localStorage.setItem(SAVED_SEARCHES, JSON.stringify(updatedSavedSearches));

  return updatedSavedSearches;
}

export default getSavedSearches;
