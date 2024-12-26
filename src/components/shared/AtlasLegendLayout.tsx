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
  const layoutParams = route?.useSearch();
  console.log(layoutParams, route._to);

  return (
    <div id="legend-content" className={`atlas-legend ${className}`}>
      {children}
      <div className="legend-footer">
        <a href={`asdf`} target="_blank" rel="noopener noreferrer">
          FOOTER
        </a>
      </div>
    </div>
  );
}

export default LegendLayout;
