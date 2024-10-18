import { useEffect, useState } from "react";
import L from "leaflet";
import { Marker, Popup, Polyline } from "react-leaflet";
import useOverpassAPI from "../../hooks/useOverpassAPI";
import { useQuery } from "@tanstack/react-query";

export default function Overpass({
  activeAdministrativeRegion,
  activeLocationType,
  economicOverpassQueries,
  informationalOverpassQueries,
  diplomaticOverpassQueries,
  militaryOverpassQueries,
}) {
  // ⚡
  const overpassQuery = `
  [out:json][timeout:25];
  
  // Fetch area for the selected region
  area["ISO3166-1"="${activeAdministrativeRegion["alpha-2"]}"]->.name;
  (
    // Fetch features based on the active location type (e.g., aerodromes)
    nwr["power"="plant"](area.name);
  );
  
  out geom;
  `;
  const power = L.divIcon({
    html: "⚡",
    className: "emoji-icon emoji-category",
  });

  // Wind Power Plant
  const wind = L.divIcon({
    html: "🌬️",
    className: "emoji-icon",
  });

  // Solar Power Plant
  const solar = L.divIcon({
    html: "☀️",
    className: "emoji-icon",
  });

  // Biomass Power Plant
  const biomass = L.divIcon({
    html: "🌿",
    className: "emoji-icon",
  });

  // Hydroelectric Power Station
  const hydro = L.divIcon({
    html: "🌊",
    className: "emoji-icon",
  });

  // Coal-fired Power Station
  const coal = L.divIcon({
    html: "🌑",
    className: "emoji-icon",
  });

  // Gas-fired Power Station
  const gas = L.divIcon({
    html: "💧",
    className: "emoji-icon",
  });

  // Oil-fired Power Plant
  const oil = L.divIcon({
    html: "🛢️",
    className: "emoji-icon",
  });

  // Geothermal Energy Power Plant
  const geothermal = L.divIcon({
    html: "♨️",
    className: "emoji-icon",
  });

  // Nuclear Power Plant
  const nuclear = L.divIcon({
    html: "☢️",
    className: "emoji-icon",
  });

  // Waste Incineration Plants
  const waste = L.divIcon({
    html: "🗑️",
    className: "emoji-icon",
  });

  // Battery Storage Plant
  const battery = L.divIcon({
    html: "🔋",
    className: "emoji-icon",
  });

  // Tidal Power Plant
  const tidal = L.divIcon({
    html: "🌊",
    className: "emoji-icon",
  });

  const iconMap = {
    wind,
    solar,
    biomass,
    hydro,
    coal,
    gas,
    oil,
    geothermal,
    nuclear,
    waste,
    battery,
    tidal,
  };

  const { data } = useQuery({
    queryKey: [`OverpassData-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
  });

  // Helper function to render nodes (e.g. points of interest like restaurants)
  const renderNode = (node: any) => {
    const { id, lat, lon, tags } = node;
    const name = tags?.name || "Unnamed";
    const icon = power || iconMap[tags["plant:source"]];
    return (
      <Marker key={id} position={[lat, lon]} icon={icon}>
        <Popup>
          <p>{tags["plant:output:electricity"]}</p>
          <h4>{name}</h4>
          <p>{tags["name:en"]}</p>
          <pre>{JSON.stringify(tags, null, 2)}</pre>
        </Popup>
      </Marker>
    );
  };

  // Helper function to render ways (e.g. roads, areas defined by nodes)
  const renderWay = (way: any) => {
    const { id, geometry, tags } = way;

    const coordinates = geometry.map((point: any) => [point.lat, point.lon]);

    const name = tags?.name || "Unnamed Way";
    const icon = iconMap[tags["plant:source"]] || power;
    return (
      <Polyline
        key={id}
        positions={coordinates}
        color="hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))"
        weight={8}
      >
        <Marker key={id} position={coordinates[0]} icon={icon}>
          <Popup>
            <p>{tags["plant:output:electricity"]}</p>
            <h4>{name}</h4>
            <p>{tags["name:en"]}</p>
            <pre>{JSON.stringify(tags, null, 2)}</pre>
          </Popup>
        </Marker>
      </Polyline>
    );
  };
  // Helper function to render relations (e.g. complex structures involving multiple elements)
  const renderRelation = (relation: any) => {
    const { id, members, tags } = relation;

    const wayMembers = members.filter((member: any) => member.type === "way");

    const coordinates = wayMembers
      .map((member: any) => {
        if (member.geometry) {
          return member.geometry.map((point: any) => [point.lat, point.lon]);
        }
        return [];
      })
      .filter((coords) => coords.length > 0); // Filter out empty coordinate arrays

    if (coordinates.length === 0) return null; // Don't render if no valid coordinates

    const name = tags?.name || "Unnamed Relation";

    return (
      <>
        {coordinates.map((coords: any, idx: number) => (
          <Polyline
            key={idx}
            positions={coords}
            color="hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))"
            weight={8}
          >
            <Popup>
              <h4>{name}</h4>
              <p>{tags["name:en"]}</p>
              <pre>{JSON.stringify(tags, null, 2)}</pre>
            </Popup>
          </Polyline>
        ))}
      </>
    );
  };

  return (
    <>
      {data &&
        data.elements.map((element: any) => {
          if (element.type === "way") {
            return renderWay(element);
          }
          if (element.type === "relation") {
            return renderRelation(element);
          }
          if (element.type === "node") {
            return renderNode(element);
          }
          return null;
        })}
    </>
  );
}
