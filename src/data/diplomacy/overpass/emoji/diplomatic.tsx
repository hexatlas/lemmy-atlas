import L from "leaflet";

/*
  DIPLOMATIC LOCATIONS
*/

const defaultIcon = L.divIcon({
  html: "🕊️", // Default for any unclassified diplomatic location
  className: "emoji-icon",
});

const embassy = L.divIcon({
  html: "🏛️", // Embassy
  className: "emoji-icon",
});

const consulate = L.divIcon({
  html: "🏢", // Consulate
  className: "emoji-icon",
});

const liaison = L.divIcon({
  html: "🤝", // Diplomatic
  className: "emoji-icon",
});

const conference_centre = L.divIcon({
  html: "🏨", // Conference Centre
  className: "emoji-icon",
});

export const iconMap = {
  embassy,
  consulate,
  liaison,
  conference_centre,
  defaultIcon,
};
