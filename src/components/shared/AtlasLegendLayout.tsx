import React, { ReactNode } from 'react';

function LegendLayout({
  children,
  className,
  route,
}: {
  children: ReactNode;
  className?;
  route?;
}) {
  return (
    <article
      className={`layout ${className}`}
      aria-label="Legend Content"
      aria-description="View the selected information"
    >
      {children}
      <footer className="legend__footer" aria-label="Legend Footer">
        <blockquote>
          <b>Note:</b> Data availability and quality varies between locations.
        </blockquote>
      </footer>
    </article>
  );
}

export default LegendLayout;
