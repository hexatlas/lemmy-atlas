// import center from "@turf/center";
import L from "leaflet";
import { useState } from "react";
import administrativeRegionsData from "../data/administrative_regions_extended.json";

// export function getColor(d) {
//   return d > 25
//     ? "#800026"
//     : d > 20
//     ? "#E31A1C"
//     : d > 15
//     ? "#FD8D3C"
//     : d > 10
//     ? "#FEB24C"
//     : d > 5
//     ? "#FED976"
//     : "#FFEDA0";
// }

// export function getCenterOfGeoJson(geoJson) {
//   return center(geoJson).geometry.coordinates.reverse();
// }

export function handleRandom(setActiveAdministrativeRegion) {
  setActiveAdministrativeRegion(
    administrativeRegionsData?.features[
      Math.floor(administrativeRegionsData?.features.length * Math.random())
    ].properties
  );
}

export function layersUtils(geoJsonRef, mapRef) {
  function highlightOnClick(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      color: "#f90303",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geoJsonRef.current.leafletElement.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    mapRef.current.leafletElement.fitBounds(e.target.getBounds());
  }

  return { highlightOnClick, resetHighlight, zoomToFeature };
}

export function Resizeable({ children }) {
  const [size, setSize] = useState({ x: 400, y: 300 });

  const handler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent) {
      setSize((currentSize) => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <div id="container" style={{ width: size.x, height: size.y }}>
      <button id="draghandle" type="button" onMouseDown={handler}>
        Resize
      </button>
    </div>
  );
}
