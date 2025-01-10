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
    <>
      <section
        className={`layout ${className}`}
        aria-label="Legend Content"
        aria-description="View the selected information"
      >
        {children}
      </section>
      <footer className="legend__footer" aria-label="Legend Footer">
        <blockquote>
          <b>Note:</b> Data availability and quality varies between locations.
        </blockquote>
      </footer>
    </>
  );
}

export default LegendLayout;
