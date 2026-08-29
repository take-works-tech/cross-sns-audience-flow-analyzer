/**
 * Arrowheads for the flow edges.
 *
 * These live in a zero-sized SVG next to the React Flow surface: SVG marker
 * references (`url(#id)`) resolve document-wide, so one <defs> serves every
 * edge without duplicating ids inside the edge layer.
 */
export const OBSERVED_MARKER_ID = "flow-arrow-observed";
export const ESTIMATED_MARKER_ID = "flow-arrow-estimated";

export function EdgeMarkers() {
  return (
    <svg
      className="pointer-events-none absolute size-0 overflow-hidden"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={OBSERVED_MARKER_ID}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M0,1.5 L8,5 L0,8.5 z"
            fill="var(--color-accent)"
            opacity="0.8"
          />
        </marker>
        <marker
          id={ESTIMATED_MARKER_ID}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M0,1.5 L8,5 L0,8.5 z"
            fill="var(--color-particle-est)"
            opacity="0.55"
          />
        </marker>
      </defs>
    </svg>
  );
}
