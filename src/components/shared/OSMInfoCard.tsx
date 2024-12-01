import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

function AtlasOSMInfoCard({
  map,
  element,
  index,
  iconMap = {},
  filterKeys = [],
  children = <></>,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
  activeElement,
}) {
  const { name, wikidata } = element?.tags;

  return (
    <Collapsible.Root
      key={index}
      className={`overpass-item ${element == activeElement && 'active'}`}
      onMouseEnter={() => handleMouseEnter(element)} // Trigger zoom on hover
      onMouseLeave={() => handleMouseLeave(element)} // Revert zoom on leave
      onClick={() => handleClick(element)} // Fly to on click
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent default scrolling behavior on Space
          handleClick(element);
        }
      }}
      aria-label={name}
      role="button"
    >
      {iconMap && filterKeys && (
        <div className="overpass-filterkey">
          {iconMap[element?.tags[filterKeys[0]]]?.options?.html ? (
            <span>{iconMap[element?.tags[filterKeys[0]]]?.options?.html}</span>
          ) : (
            <span>{iconMap['defaultIcon']?.options?.html}</span>
          )}
          {filterKeys.map((filterKey, index) => {
            if (index > 0) return;
            return (
              <>
                {element?.tags[filterKey] && (
                  <small key={index}>{element?.tags[filterKey]}</small>
                )}
              </>
            );
          })}
          <Collapsible.Trigger className="overpass-expand">
            🗃️
          </Collapsible.Trigger>
        </div>
      )}
      {children}
      <div className="overpass-container">
        <div className="overpass-name">
          {wikidata && (
            <a
              href={`https://www.wikidata.org/wiki/${wikidata}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wikidata"
            >
              <WikiData />
            </a>
          )}
          {name && <h4>{name}</h4>}
          {element?.tags['name:en'] && <h6>{element?.tags['name:en']}</h6>}
        </div>
        {iconMap && filterKeys && (
          <div className="overpass-filterkeys">
            {filterKeys.map((filterKey, index) => {
              if (index < 1) return;
              return (
                <>
                  {element?.tags[filterKey] && (
                    <small key={index}>{element?.tags[filterKey]}</small>
                  )}
                </>
              );
            })}
          </div>
        )}
        {element?.tags?.source &&
          [...new Set(element.tags.source.split(';'))].map((url, index) => {
            let isUrl;

            try {
              isUrl = new URL(url.toString());
            } catch (_) {
              return false;
            }
            return (
              <div className="overpass-urls" key={index}>
                <>
                  {isUrl && (
                    <a
                      key={index}
                      href={isUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {url.toString()}
                    </a>
                  )}
                  {element?.tags?.website && (
                    <a
                      href={element?.tags?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {element?.tags?.website}
                    </a>
                  )}
                </>
              </div>
            );
          })}
      </div>
      <Collapsible.Content className="overpass-json dark">
        <pre>{JSON.stringify(element?.tags, undefined, 2)}</pre>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

const WikiData = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.2"
      viewBox="0 0 1000 700"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="m 119.4207,543.01679 h 29.16277 V 43.052497 H 119.4207 V 543.01679 z m 60.27256,0 h 89.42926 V 43.052497 H 179.69326 V 543.01679 z M 298.29136,43.052497 V 542.99895 h 89.42926 V 43.052497 h -89.42926 z"
        fill="#990000"
      />
      <path
        d="m 838.97933,543.0524 h 29.16883 V 43.052437 H 838.97933 V 543.0524 z M 899.25795,43.052437 V 543.0524 h 29.16277 V 43.052437 H 899.25795 z M 417.85387,543.05247 h 29.16277 V 43.052497 H 417.85387 V 543.05247 z M 478.13249,43.052497 V 543.03463 h 29.16884 V 43.052497 h -29.16884 z"
        fill="#339966"
      />
      <path
        d="m 537.42244,543.05247 h 89.4414 V 43.052497 h -89.4414 V 543.05247 z m 118.5981,0 h 31.10372 V 43.052497 H 656.02054 V 543.05247 z M 716.2931,43.052497 V 543.03463 h 89.42926 V 43.052497 H 716.2931 z"
        fill="#006699"
      />
      <path
        d="m 883.98859,598.08811 46.01562,103.68359 -27.75781,0 -8.53516,-20.48438 -46.38672,0 -7.71875,20.48438 -27.38672,0 41.78516,-103.68359 29.98438,0 m 2.07812,65.08984 -16.69922,-40.30078 -15.21484,40.30078 31.91406,0 m -60.26562,-65.08984 0,19 -37.55469,0 0,84.68359 -25.82813,0 0,-84.68359 -37.55468,0 0,-19 100.9375,0 m -133.59375,0 46.01562,103.68359 -27.75781,0 -8.53516,-20.48438 -46.38672,0 -7.71875,20.48438 -27.38672,0 41.78516,-103.68359 29.98438,0 m 2.07812,65.08984 -16.69922,-40.30078 -15.21484,40.30078 31.91406,0 m -176.56641,-65.08984 45.71875,0 c 17.66399,10e-5 31.6171,4.84905 41.85938,14.54687 10.29156,9.64852 15.43739,22.142 15.4375,37.48047 -1.1e-4,16.08076 -5.22016,28.72268 -15.66016,37.92578 -10.39071,9.15365 -25.23444,13.73047 -44.53125,13.73047 l -42.82422,0 0,-103.68359 m 25.82813,19 0,65.68359 16.84766,0 c 10.93483,2e-5 19.2968,-2.99347 25.08593,-8.98047 5.78898,-6.03642 8.68351,-13.97782 8.6836,-23.82422 -9e-5,-10.19264 -2.9441,-18.20826 -8.83203,-24.04687 -5.83862,-5.88794 -14.25007,-8.83195 -25.23438,-8.83203 l -16.55078,0 m -49.72656,-19 0,103.68359 -25.82813,0 0,-103.68359 25.82813,0 m -48.91016,0 -33.76953,48.6875 45.79297,54.99609 -32.35938,0 -41.04297,-48.61328 0,48.61328 -25.82812,0 0,-103.68359 25.82812,0 0,46.68359 32.95313,-46.68359 28.42578,0 m -111.10547,0 0,103.68359 -25.82812,0 0,-103.68359 25.82812,0 m -127.21094,37.40625 -32.0625,67.61328 -11.13281,0 -45.57031,-105.01953 27.38672,0 24.41797,57.29687 26.64453,-57.29687 20.78125,0 26.64453,57.29687 24.26953,-57.29687 27.38672,0 -45.42188,105.01953 -11.13281,0 -32.21094,-67.61328"
        fill="#484848;fill-opacity:1;stroke:none;font-family:Gill Sans MT"
      />
    </svg>
  );
};

export default AtlasOSMInfoCard;