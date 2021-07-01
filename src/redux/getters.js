export const getFeatures = (state) => state.features;
export const getSelectedFeature = (state) => state.selectedFeature;
export const getComparisonFeatures = (state) => state.comparisonFeatures;
export const getComparisonType = (state) => state.comparisonType;
export const getHamburgerMenuOpen = (state) => state.hamburgerMenuOpen;
export const getHiddenSidebarDialogs = (state) => state.hiddenSidebarDialogs;
export const getANZSICCodes = (state) => state.anzsicCodes;

// Two features are considered equal is their id numbers are the same.
// Necessary to prevent hooks from thinking two features are different just
// because they are different JS objects.
//
// Usage:
// const selectedFeature = useSelector(getSelectedFeature, featuresEqual)
export const featuresEqual = (a, b) => a?.properties?.SA2_MAIN16 === b?.properties?.SA2_MAIN16;
