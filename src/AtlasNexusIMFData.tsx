// https://www.imf.org/external/datamapper/api/help

import { useState, useEffect, useRef } from "react";

import * as d3 from "d3";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { indicators } from "./data/indicatorsIMF.json";
import { useIMFDataTransform } from "./hooks/useDataTransform";

const AtlasNexusIMFData = ({
  // Util
  isMobile,
  resetAtlas,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

  regionTypes,
  activeRegionType,
  setActiveRegionType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  // Data
  activeIndicator,
  setActiveIndicator,

  // Community
  lemmyInstances,
  activeLemmyInstance,
  setActiveLemmyInstance,

  activeCommunity,
  setActiveCommunity,

  activeSearchType,
  setActiveSearchType,

  listingTypes,
  activeListingType,
  setActiveListingType,

  sortTypes,
  activeSortType,
  setActiveSortType,

  // Styles
  administrativeRegionStyle,
  administrativeRegionStyleHovered,
}) => {
  const [open, setOpen] = useState(false);

  /*
    useStates
    */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const indicatorsArray = useIMFDataTransform(indicators);

  /*
      useEffects
      */

  // Transfroms, filters and sorts IMF Indicators JSON

  const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([1980, 2028]).range([0, width]);

      // Dynamically adjust y-axis scale based on data variance
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .nice()
        .range([height, 0]);

      const line = d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.value));

      const chartData = Object.entries(data).map(([year, value]) => ({
        year: parseInt(year),
        value,
      }));

      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "#f2c20c")
        .attr("stroke-width", 1.312)
        .attr("d", line);

      svg
        .selectAll("circle")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.value))
        .attr("r", 1.61)
        .attr("fill", "#f2c20c");

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g").call(d3.axisLeft(y));

      // Cleanup function to remove D3 elements on unmount
      return () => {
        svg.selectAll("*").remove();
        tooltip.remove();
      };
    }, [data]);

    return <svg ref={svgRef}></svg>;
  };

  const YearsList = ({ data, indicator, country }) => {
    // Check if the indicator and country exist in the data
    if (!data[indicator] || !data[indicator][country] || data === undefined) {
      return (
        <>
          {!loading && (
            <div>No data available for the specified indicator and country.</div>
          )}
        </>
      );
    }

    // Extracting years and values from the object
    const yearsData = data[indicator][country];
    const years = Object.keys(yearsData);
    const [open, setOpen] = useState(false);
    return (
      <div>
        <LineChart data={yearsData} />
        <p>
          <strong>Unit:</strong> {activeIndicator.unit}
        </p>
        <Collapsible.Root className="CollapsibleRoot" open={open} onOpenChange={setOpen}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
            }}
          >
            <span className="Text">
              <p>Raw Data</p>
            </span>
            <Collapsible.Trigger asChild>
              <button
                className="icon-button"
                role="button"
                aria-label={open ? "Hide information" : "Show more Information"}
              >
                {open ? "x" : "ⓘ"}
              </button>
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content>
            <ul>
              {years.map((year) => (
                <li
                  key={year}
                  className={`${
                    Number(year) === new Date().getFullYear() ? "highlight" : ""
                  }`}
                >
                  {year}:
                  <strong>
                    {yearsData[year].toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    );
  };

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.values);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeIndicator && activeAdministrativeRegion.country !== "country") {
      const apiUrl = `/.netlify/functions/data_imf_api/?indicator=${
        activeIndicator.name
      }&country=${activeAdministrativeRegion["ISO3166-1-Alpha-3"]}/${
        administrativeRegionClickHistoryArray[0].country !== "country" &&
        administrativeRegionClickHistoryArray[0]["ISO3166-1-Alpha-3"]
      }`;
      fetchData(apiUrl);
    }
  }, [activeAdministrativeRegion, activeIndicator]);

  // const IndicatorDropdown = ({ indicators }) => {
  //   const [selectedIndicator, setSelectedIndicator] = useState(null);

  //   const handleSelectChange = (event) => {
  //     const selectedValue = event.target.value;
  //     setSelectedIndicator(
  //       indicators.find((indicator) => indicator.name === selectedValue)
  //     );
  //   };

  //   return (
  //     <div>
  //       <label htmlFor="indicatorDropdown"></label>
  //       <select id="indicatorDropdown" onChange={handleSelectChange}>
  //         <option value="" disabled selected>
  //           Select an indicator
  //         </option>
  //         {indicators.map((indicator) => (
  //           <option key={indicator.name} value={indicator.name}>
  //             {indicator.label}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //   );
  // };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="icon-button" aria-label="IMF Data Settings Menu">
            ☰
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-menu-content">
            <DropdownMenu.Item className="dropdown-menu-item">
              <div
                className="reset-container"
                role="button"
                aria-label={"Reset Settings"}
                tabIndex={0}
                onClick={resetAtlas}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Space") {
                    resetAtlas;
                  }
                }}
              >
                <p>Reset</p>
                <div className="right-slot reset-button">⟲</div>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="dropdown-menu-separator" />
            <DropdownMenu.Label className="dropdown-menu-label">Data</DropdownMenu.Label>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                data.imf.org
                <div className="right-slot">▸</div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className="dropdown-menu-subcontent"
                  // sideOffset={2}
                  // alignOffset={-5}
                >
                  <DropdownMenu.RadioGroup
                    value={activeIndicator}
                    onValueChange={setActiveIndicator}
                  >
                    {indicatorsArray.map((indicator, index) => (
                      <DropdownMenu.RadioItem
                        key={index}
                        className="dropdown-menu-radio-item"
                        value={indicator as any}
                      >
                        <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                          ✔
                        </DropdownMenu.ItemIndicator>
                        {indicator.label}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            <DropdownMenu.Separator className="dropdown-menu-separator" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <Collapsible.Root className="CollapsibleRoot" open={open} onOpenChange={setOpen}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3>{activeIndicator.label}:</h3>
          <Collapsible.Trigger asChild>
            <button
              className="icon-button"
              aria-label={open ? "Hide information" : "Show more Information"}
            >
              {open ? "x" : "ⓘ"}
            </button>
          </Collapsible.Trigger>
        </div>
        <div className="indicator-name">
          <span className="Text">
            <strong>Name:</strong> {activeIndicator.name}
          </span>
        </div>
        <Collapsible.Content>
          {activeIndicator.description && (
            <p>
              <strong>Description:</strong> {activeIndicator.description}
            </p>
          )}
          <p>
            <strong>Source:</strong> {activeIndicator.source}
          </p>
          <p>
            <strong>Dataset:</strong> {activeIndicator.dataset}
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
      {data && (
        <YearsList
          data={data}
          indicator={activeIndicator.name}
          country={activeAdministrativeRegion["ISO3166-1-Alpha-3"]}
        />
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* {indicators && <IndicatorDropdown indicators={indicators} />} */}
    </>
  );
};

export default AtlasNexusIMFData;
