// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

export function AtlasMisc({
  // Util
  isMobile,
  resetAtlas,
  sideBarRef,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  isLocationSelectMode,
  setIsLocationSelectMode,

  activeLocationSelection,
  setActiveLocationSelection,

  nominatim,
  setNominatim,

  regionTypes,
  activeLocationType,
  setActiveLocationType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  // Data
  activeIndicator,
  setActiveIndicator,
}) {
  return (
    <div id="legend-content">
      <h3>BannedThought.net</h3>
      <a
        href="http://bannedthought.net/RecentPostings.htm"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Recent Posts
      </a>
      <br />
      {activeAdministrativeRegion.country != "country" && (
        <a
          href={`http://bannedthought.net/${encodeURI(
            activeAdministrativeRegion[activeLocationType]
          ).replace(/%20/g, "-")}/index.htm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Resources on {activeAdministrativeRegion[activeLocationType]}
        </a>
      )}
      <h3>WorldAtlas.com</h3>
      {activeAdministrativeRegion.country != "country" && (
        <>
          <a
            href={`https://www.worldatlas.com/maps/${encodeURI(
              activeAdministrativeRegion[activeLocationType]
            )
              .replace(/%20/g, "-")
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 World Atlas on {activeAdministrativeRegion[activeLocationType]}
          </a>
        </>
      )}
    </div>
  );
}

export default AtlasMisc;
