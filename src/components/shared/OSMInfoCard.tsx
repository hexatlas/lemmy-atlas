import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/accordion
import * as Accordion from '@radix-ui/react-accordion';

import { OSMInfoCardProps } from '../../types/atlas.types';
import { ReactNode } from '@tanstack/react-router';

import wikidataIcon from '../../assets/icons/wikidata.svg';

function AtlasOSMInfoCard({
  element,
  index,
  iconMap = {},
  filterKeys = [],
  children = <></>,
  handleClick,
  activeElement,
}: OSMInfoCardProps) {
  const {
    name,
    wikidata,
    'name:en': nameEN,
    source,
    website,
  } = element?.tags || {};

  return (
    <Accordion.Item
      key={index}
      value={name}
      className={`item neutral ${element == activeElement && 'active'}`}
      onClick={() => handleClick(element)}
      onFocus={() => handleClick(element)}
      aria-label={name}
      role="listitem"
    >
      {iconMap && filterKeys && (
        <div aria-label="list header">
          <div className="item__filterkey" aria-label={`Filterkey`}>
            {iconMap[element?.tags[filterKeys[0]]]?.options?.html ? (
              <span className="emoji" aria-hidden="true">
                {
                  iconMap[element?.tags[filterKeys[0]]]?.options
                    ?.html as ReactNode
                }
              </span>
            ) : (
              <span className="emoji default" aria-hidden="true">
                {iconMap['defaultIcon']?.options?.html as ReactNode}
              </span>
            )}
            {filterKeys.map((filterKey, index) => {
              if (index > 0) return;
              return (
                <div key={index}>
                  {element?.tags[filterKey] && (
                    <small key={index} aria-label={filterKey}>
                      {element?.tags[filterKey]}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {children}
      <div className="item__container" aria-label="list body">
        <div className="item__name">
          <div className="wrapper">
            {wikidata && (
              <a
                href={`https://www.wikidata.org/wiki/${wikidata}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="wikidata"
              >
                <img
                  src={wikidataIcon}
                  alt="Lemmy Logo"
                  className="custom-icon"
                />{' '}
              </a>
            )}
            {source && <span>🔗</span>}
          </div>
          {name && <h4>{name}</h4>}
          {nameEN && <h6>{nameEN}</h6>}
        </div>
        {iconMap && filterKeys && (
          <div className="item__filterkeys">
            {filterKeys.map((filterKey, index) => {
              if (index < 1) return;
              return (
                <p
                  key={index}
                  aria-label={element?.tags[filterKey]}
                  aria-description={filterKey}
                >
                  {element?.tags[filterKey] && (
                    <small key={index}>{element?.tags[filterKey]}</small>
                  )}
                </p>
              );
            })}{' '}
          </div>
        )}
      </div>
    </Accordion.Item>
  );
}

export default React.memo(AtlasOSMInfoCard);
