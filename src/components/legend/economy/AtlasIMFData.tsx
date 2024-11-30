// https://www.imf.org/external/datamapper/api/help

import { useState, useEffect, useRef } from 'react';

import * as d3 from 'd3';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// https://www.imf.org/external/datamapper/api/v1/indicators
import { indicators } from '../../../data/indicatorsIMF.json';
import { useIMFDataTransform } from '../../../hooks/useDataTransform';
import { useStateStorage } from '../../../hooks/useAtlasUtils';
import { useQuery } from '@tanstack/react-query';
/*
 /$$$$$$ /$$      /$$ /$$$$$$$$         
|_  $$_/| $$$    /$$$| $$_____/         
  | $$  | $$$$  /$$$$| $$               
  | $$  | $$ $$/$$ $$| $$$$$            
  | $$  | $$  $$$| $$| $$__/            
  | $$  | $$\  $ | $$| $$               
 /$$$$$$| $$ \/  | $$| $$               
|______/|__/     |__/|__/               
                                        
                                        
                                        
 /$$$$$$$              /$$              
| $$__  $$            | $$              
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ 
| $$  | $$ |____  $$|_  $$_/   |____  $$
| $$  | $$  /$$$$$$$  | $$      /$$$$$$$
| $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$
| $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$
|_______/  \_______/   \___/   \_______/
                                        
                                        
                                        
*/

const AtlasIMFData = ({ activeAdministrativeRegion }) => {
  const defaultIndicator = {
    name: 'PPPSH',
    label: 'GDP based on PPP, share of world',
    description:
      'Purchasing Power Parity (PPP) weights are individual countries\' share of total World gross domestic product at purchasing power parities.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
    source: 'World Economic Outlook (October 2024)',
    unit: 'Percent of World',
    dataset: 'WEO',
  };

  const [activeIndicator, setActiveIndicator] = useStateStorage(
    'activeIndicator',
    defaultIndicator,
  );

  const [open, setOpen] = useState(false);

  /*
    useStates
    */

  const [loading, setLoading] = useStateStorage('loading', true);
  const [error, setError] = useStateStorage('error', null);

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

      // Clear existing SVG content
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3
        .select(svgRef.current)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr(
          'viewBox',
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom * 2
          }`,
        )
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([1980, 2028]).range([0, width]);
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

      // Add X axis with label
      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style(
          'color',
          'hsl(var(--atlas-color-light) / var(--atlas-opacity-1))',
        )
        .style('text-anchor', 'end');

      // Add X axis label
      svg
        .append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 5)
        .text('Year')
        .style(
          'fill',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
        )
        .style('font-size', 'var(--atlas-size-09)');

      // Add Source
      svg
        .append('text')
        .attr('class', 'x-label')
        .attr('x', 0)
        .attr('y', height + margin.bottom * 1.312)
        .text(`${String(activeIndicator.source).toUpperCase()} | data.imf.org`)
        .style('fill', 'hsl(var(--atlas-color-light) / var(--atlas-opacity-2))')
        .style('font-size', 'var(--atlas-size-09)');

      // Add Y axis with label
      svg.append('g').call(d3.axisLeft(y));

      // Add Y axis label
      svg
        .append('text')
        .attr('class', 'y-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 12)
        .attr('x', -height / 2)
        .text(activeIndicator.unit)
        .style(
          'fill',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
        )
        .style('font-size', 'var(--atlas-size-09)');

      // Add chart title (optional)
      svg
        .append('text')
        .attr('class', 'chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .text(
          `${activeAdministrativeRegion.country} | ${activeIndicator.label}`,
        )
        .style('fill', 'hsl(var(--atlas-color-light) / var(--atlas-opacity-3))')
        .style('font-size', 'var(--atlas-size-09)')
        .style('font-weight', 'bold');

      // Add horizontal grid lines
      svg
        .append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', '2,2')
        .style('stroke-opacity', 'var(--atlas-opacity-1)');

      // Add vertical grid lines
      svg
        .append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', '2,2')
        .style('stroke-opacity', 'var(--atlas-opacity-1)');

      svg
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr(
          'stroke',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-2))',
        )
        .attr('stroke-width', 1.312)
        .attr('d', line);

      // Create tooltip
      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style(
          'background-color',
          'hsl(var(--atlas-color-dark) / var(--atlas-opacity-2))',
        )
        .style(
          'color',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
        )
        .style('padding', 'var(--atlas-size-09)')
        .style('border-radius', 'var(--atlas-border-radius-1)')
        .style('font-size', 'var(--atlas-size-09)')
        .style('pointer-events', 'none')
        .style('opacity', 0);

      // Add vertical and horizontal helper lines
      const verticalLine = svg
        .append('line')
        .attr('class', 'helper-line')
        .style(
          'stroke',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-2))',
        )
        .style('stroke-dasharray', '2,2')
        .style('opacity', 0);

      const horizontalLine = svg
        .append('line')
        .attr('class', 'helper-line')
        .style(
          'stroke',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-2))',
        )
        .style('stroke-dasharray', '2,2')
        .style('opacity', 0);

      // Add points with hover effects
      svg
        .selectAll('circle')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y(d.value))
        .attr('r', 'var(--atlas-size-14)')
        .attr(
          'fill',
          'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
        )
        .on('mouseover', function (event, d) {
          const [mouseX, mouseY] = d3.pointer(event);

          // Show tooltip
          tooltip
            .style('opacity', 1)
            .html(`${d.value} ${activeIndicator.unit} in ${d.year}`)
            .style('left', event.pageX - 10 + 'px')
            .style('top', event.pageY + 10 + 'px')
            .style('z-index', '9999');

          // Show helper lines
          verticalLine
            .attr('x1', x(d.year))
            .attr('y1', 0)
            .attr('x2', x(d.year))
            .attr('y2', height)
            .style('opacity', 1);

          horizontalLine
            .attr('x1', 0)
            .attr('y1', y(d.value))
            .attr('x2', width)
            .attr('y2', y(d.value))
            .style('opacity', 1);

          // Highlight point
          d3.select(this)
            .attr('r', 'var(--atlas-size-09)')
            .attr(
              'fill',
              'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-2))',
            );
        })
        .on('mouseout', function () {
          // Hide tooltip
          tooltip.style('opacity', 0);

          // Hide helper lines
          verticalLine.style('opacity', 0);
          horizontalLine.style('opacity', 0);

          // Reset point
          d3.select(this)
            .attr('r', 'var(--atlas-size-14)')
            .attr(
              'fill',
              'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
            );
        });

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      svg.append('g').call(d3.axisLeft(y));

      // Cleanup function
      return () => {
        svg.selectAll('*').remove();
        tooltip.remove();
      };
    }, [data]);

    return <svg ref={svgRef}></svg>;
  };

  const YearsList = ({ data, indicator, country }) => {
    // Check if the indicator.name and country exist in the data
    if (
      !data[indicator.name] ||
      !data[indicator.name][country] ||
      data === undefined
    ) {
      return (
        <>
          {!loading && (
            <div>
              No data available for the specified indicator.name and country.
            </div>
          )}
        </>
      );
    }

    // Extracting years and values from the object
    const yearsData = data[indicator.name][country];
    const years = Object.keys(yearsData);
    const [open, setOpen] = useState(false);
    return (
      <div>
        <LineChart data={yearsData} />
        <Collapsible.Root
          className="CollapsibleRoot"
          open={open}
          onOpenChange={setOpen}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: "space-between",
            }}
          >
            <span className="Text">
              <p>Show Table</p>
            </span>
            <Collapsible.Trigger asChild>
              <button
                className="button-icon"
                role="button"
                aria-label={open ? 'Hide information' : 'Show more Information'}
              >
                {open ? 'x' : 'ⓘ'}
              </button>
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>{activeIndicator.unit}</th>
                </tr>
              </thead>
              <tbody>
                {years.map((year) => (
                  <tr
                    key={year}
                    className={
                      Number(year) === new Date().getFullYear()
                        ? 'highlight'
                        : ''
                    }
                  >
                    <td>{year}</td>
                    <td>
                      <strong>
                        {yearsData[year].toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      return result.values;
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const apiUrl = `/.netlify/functions/data_imf_api/?indicator=${activeIndicator.name}&country=${activeAdministrativeRegion['ISO3166-1-Alpha-3']}/`;

  const { data, isLoading } = useQuery({
    queryKey: [`AL-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => fetchData(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return (
    <div id="legend-content">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="button-icon" aria-label="IMF Data Settings Menu">
            ☰
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-menu-content">
            <DropdownMenu.Item className="dropdown-menu-item">
              <div
                className="reset-container"
                role="button"
                aria-label={'Reset Settings'}
                tabIndex={0}
                onClick={() => setActiveIndicator(defaultIndicator)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Space') {
                    () => setActiveIndicator(defaultIndicator);
                  }
                }}
              >
                <p>Reset</p>
                <div className="right-slot reset-button">⟲</div>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="dropdown-menu-separator" />
            <DropdownMenu.Label className="dropdown-menu-label">
              Data
            </DropdownMenu.Label>
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
      <h3>Where does line go? </h3>
      {data && (
        <YearsList
          data={data}
          indicator={activeIndicator}
          country={activeAdministrativeRegion['ISO3166-1-Alpha-3']}
        />
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Collapsible.Root
        className="CollapsibleRoot"
        open={open}
        onOpenChange={setOpen}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Collapsible.Trigger asChild>
            <button
              className="button-icon"
              aria-label={open ? 'Hide information' : 'Show more Information'}
            >
              {open ? 'x' : 'ⓘ'}
            </button>
          </Collapsible.Trigger>
        </div>
        <div className="indicator-name">
          <span className="Text">
            <strong>Description of </strong> {activeIndicator.name}
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
      {/* {indicators && <IndicatorDropdown indicators={indicators} />} */}
    </div>
  );
};

export default AtlasIMFData;
