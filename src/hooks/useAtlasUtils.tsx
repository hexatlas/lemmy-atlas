// import center from "@turf/center";
import L from "leaflet";
import { useState, useEffect } from "react";
import administrativeRegionsData from "../data/administrative_regions_extended.json";

// HANDLE RANDOM

export function handleRandom(setActiveAdministrativeRegion) {
  setActiveAdministrativeRegion(
    administrativeRegionsData?.features[
      Math.floor(administrativeRegionsData?.features.length * Math.random())
    ].properties
  );
}

// RESIZE ATLAS LEGEND

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

// STORAGE

function getSavedValue(key, initialValue, storage) {
  try {
    const savedValue = JSON.parse(storage.getItem(key));
    if (savedValue) return savedValue;
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
  } catch (error) {
    console.log(error);
  }
}

export function useStateStorage(key, initialValue, isLocalStorage = false) {
  const storage = isLocalStorage ? localStorage : sessionStorage;
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue, storage);
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}
