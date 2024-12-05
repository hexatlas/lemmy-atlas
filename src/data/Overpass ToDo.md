```js

/*
  OVERPASS-TURBO - Map Layers
*/

interface overpassQuery {
  name: string;
  emoji: string;
  power: string;
  category: string;
  query: (iso3166: string) => string;
}

// Economic

export const economicOverpassQueries: Array<overpassQuery> = [
  {
    name: 'Economic Infrastructure',
    emoji: '🔻',
    power: 'Economic',
    category: 'Economic',
    query: (iso3166: string) => `
    [out:json][timeout:90];
    area["ISO3166-1"="${iso3166}"]->.name;
    (
      nwr["highway"](area.name);
      nwr["railway"](area.name);
      nwr["aeroway"="aerodrome"](area.name);
      nwr["port"](area.name);
      nwr["power"](area.name);
      nwr["pipeline"](area.name);
      nwr["waterway"](area.name);
      nwr["industrial"](area.name);
    );
    out geom;
  `,
  },
];

// INformation

export const informationalOverpassQueries: Array<overpassQuery> = [
  {
    name: 'Informational Infrastructure',
    emoji: '🔻',
    power: 'Informational',
    category: 'Informational',
    query: (iso3166: string) => `
    [out:json][timeout:90];
    area["ISO3166-1"="${iso3166}"]->.name;
    (
      nwr["man_made"="communications_tower"](area.name);
      nwr["man_made"="data_center"](area.name);
      nwr["amenity"="school"](area.name);
      nwr["amenity"="university"](area.name);
      nwr["amenity"="research_institute"](area.name);
      nwr["amenity"="broadcasting"](area.name);
    );
    out geom;
  `,
  },
];

// Diplomatic

export const diplomaticOverpassQueries: Array<overpassQuery> = [
  {
    name: 'Diplomatic Infrastructure',
    emoji: '🔻',
    power: 'Diplomatic',
    category: 'Diplomatic',
    query: (iso3166: string) => `
    [out:json][timeout:90];
    area["ISO3166-1"="${iso3166}"]->.name;
    (
      nwr["amenity"="embassy"](area.name);
      nwr["amenity"="consulate"](area.name);
      nwr["amenity"="diplomatic"](area.name);
      nwr["amenity"="conference_centre"](area.name);
    );
    out geom;
  `,
  },
];

// Military

export const militaryOverpassQueries: Array<overpassQuery> = [
  {
    name: 'Military Infrastructure',
    emoji: '🔻',
    power: 'Military',
    category: 'Military',
    query: (iso3166: string) => `
    [out:json][timeout:90];
    area["ISO3166-1"="${iso3166}"]->.name;
    (
      nwr["military"="base"](area.name);
      nwr["military"="barracks"](area.name);
      nwr["military"="training_area"](area.name);
      nwr["aeroway"="military"](area.name);
      nwr["port"="military"](area.name);
    );
    out geom;
  `,
  },
];

/*
1. Transportation Infrastructure

    Roads and Highways: Paved surfaces for vehicle travel.
    Bridges and Tunnels: Structures that facilitate the crossing of obstacles like rivers or mountains.
    Railways: Tracks and stations for train travel.
    Airports: Facilities for air travel, including runways, terminals, and control towers.
    Ports and Harbors: Facilities for sea and river transport, including docks and cargo handling equipment.
    Public Transit Systems: Buses, subways, trams, and light rail systems.

2. Energy Infrastructure

    Power Plants: Facilities for generating electricity (coal, natural gas, nuclear, hydroelectric, wind, solar, etc.).
    Transmission Lines: High-voltage lines that carry electricity over long distances.
    Distribution Networks: Lower-voltage lines and transformers that deliver electricity to homes and businesses.
    Oil and Gas Pipelines: Systems for transporting oil and natural gas.
    Refineries: Facilities for processing crude oil into usable products like gasoline and diesel.

3. Water and Sanitation Infrastructure

    Water Treatment Plants: Facilities for purifying water for drinking and other uses.
    Sewage Treatment Plants: Facilities for treating and disposing of wastewater.
    Pipelines and Distribution Systems: Networks of pipes that deliver water to users and remove wastewater.
    Dams and Reservoirs: Structures for storing water and controlling water flow.

4. Telecommunications Infrastructure

    Telecommunication Towers: Structures that support antennas for wireless communication.
    Fiber Optic Cables: High-speed data transmission lines.
    Data Centers: Facilities that house computer systems and associated components.
    Satellite Ground Stations: Facilities for communicating with satellites.

5. Public Services Infrastructure

    Schools and Educational Facilities: Buildings and resources for education.
    Hospitals and Healthcare Facilities: Buildings and resources for medical care.
    Public Safety Buildings: Police stations, fire stations, and emergency response centers.
    Government Buildings: Offices and facilities for government operations.

6. Environmental Infrastructure

    Waste Management Facilities: Landfills, recycling centers, and waste-to-energy plants.
    Environmental Monitoring Stations: Facilities for monitoring air and water quality.
    Green Spaces: Parks, gardens, and other natural areas.

7. Financial Infrastructure

    Banks and Financial Institutions: Buildings and systems for financial transactions.
    Stock Exchanges: Facilities and systems for trading securities.
    Payment Systems: Networks and technologies for processing payments.

8. Industrial Infrastructure

    Manufacturing Plants: Facilities for producing goods.
    ** Warehouses and Distribution Centers**: Facilities for storing and distributing products.
    Industrial Parks: Zoned areas for industrial development.

9. Agricultural Infrastructure

    Irrigation Systems: Facilities for supplying water to crops.
    Farms and Ranches: Land and facilities for growing crops and raising livestock.
    Food Processing Plants: Facilities for processing agricultural products.

10. Cultural and Recreational Infrastructure

    Sports Facilities: Stadiums, arenas, and gyms.
    Cultural Centers: Museums, theaters, and libraries.
    Recreational Parks: Facilities for leisure and recreation.


*/
/*
  - Currently not in use -

  Various APIs, also found in Economic Misc Tab
*/

```
