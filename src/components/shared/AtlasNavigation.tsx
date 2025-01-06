import React from 'react';
import { AtlasNavigation } from '../../types/atlas.types';
import { Link, Outlet } from '@tanstack/react-router';

function LegendNavigation({
  links,
  className,
  route,
}: {
  links: AtlasNavigation[];
  className?;
  route?;
}) {
  return (
    <div className={`atlas-tabs tabs-root light`}>
      <header aria-label={`Navigation Menu`} role="menubar">
        <nav
          className={`tabs-list ${className}`}
          aria-label={`Navigation Links`}
        >
          {links.map((navLink, index) => {
            const { emoji, link, isDisabled } = navLink;
            return (
              <Link
                key={index}
                className="tabs-trigger emoji-label"
                to={link}
                aria-label={link}
                title={link}
                disabled={isDisabled}
              >
                {emoji}
              </Link>
            );
          })}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default LegendNavigation;
