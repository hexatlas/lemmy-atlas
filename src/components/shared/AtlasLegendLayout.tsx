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
  console.log(layoutParams, route._to, 'layout');

  return (
    <article className={`legend-content ${className}`}>
      {children}
      <footer className="legend-footer">
        <a href={`asdf`} target="_blank" rel="noopener noreferrer">
          FOOTER
        </a>
      </footer>
    </article>
  );
}

export default LegendLayout;
