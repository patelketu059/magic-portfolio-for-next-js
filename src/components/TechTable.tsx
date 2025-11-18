"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@once-ui-system/core";

export type TechTableProps = {
  children: React.ReactNode;
  leftHeader?: string;
  hideHeader?: boolean;
  /**
   * Optional explicit column headers.
   * When provided, TechTable enters "multi-column mode":
   *   - headers are taken directly from this array
   *   - rows are expected to use `label` + `values` props
   * When omitted, the table uses legacy behavior (infers columns from row props).
   */
  columns?: string[];
  /** Optional explicit widths for each column (e.g. ["10%","20%","70%"]).
   * When provided and the array length matches `columns.length`, these widths
   * will be used as the base distribution for the table. Percent values are
   * parsed and normalized; non-percent units are used verbatim.
   */
  columnWidths?: string[];
};

export type TechRowProps = {
  label?: string;
  category?: string;
  /**
   * Optional array of values for explicit multi-column mode.
   * In that mode, a row is rendered as: [label, ...values].
   */
  values?: React.ReactNode[];
  [key: string]: unknown;
};

function formatHeader(key: string): string {
  if (key.toLowerCase() === "fid") return "FID ↓";
  const withSpaces = key.replace(/([A-Z])/g, " $1");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export function TechTable({
  children,
  leftHeader = "Label",
  hideHeader = false,
  columns,
  columnWidths,
}: TechTableProps) {
  const childArray = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<TechRowProps>[];

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tableBg = isDark ? "rgba(30,32,38,0.96)" : "rgba(255,255,255,0.98)";
  const borderColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.10)";
  const headerBg = isDark
    ? "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
    : "linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01))";
  const headerText = isDark ? "white" : "#222";
  const cellText = isDark ? "rgba(255,255,255,0.92)" : "#222";
  const leftTextColor = isDark ? "white" : "#111";
  const boxShadow = isDark
    ? "0 0 25px rgba(255,255,255,0.08)"
    : "0 0 25px rgba(0,0,0,0.06)";

  // --- MODE DETECTION ---
  // Multi-column mode is active when `columns` prop is provided.
  const isExplicitMultiColumn = Array.isArray(columns) && columns.length > 0;
  const cols = Array.isArray(columns) ? columns : [];

  // Responsive flag: when true, we'll widen the middle three columns by 10%.
  const [widenMiddleCols, setWidenMiddleCols] = useState(false);

  useEffect(() => {
    // Apply widening on viewports >= 640px (adjust breakpoint as needed)
    const mq = window.matchMedia("(min-width: 640px)");
    const handler = (e: MediaQueryListEvent) => {
      setWidenMiddleCols(!!e.matches);
    };
    // initial
    setWidenMiddleCols(mq.matches);
    // older browsers: fallback (typed without `any`)
    type MQLegacy = MediaQueryList & {
      addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    };
    const mqLegacy = mq as MQLegacy;
    if (typeof mqLegacy.addListener === "function") {
      mqLegacy.addListener(handler);
      return () => mqLegacy.removeListener?.(handler);
    }
    return undefined;
  }, []);

  // Legacy / auto-column detection (only used when NOT in explicit mode)
  const columnKeySet = new Set<string>();
  let hasDetailsColumn = false;

  if (!isExplicitMultiColumn) {
    for (const child of childArray) {
      const props = child.props || {};
      for (const key of Object.keys(props)) {
        if (key === "label" || key === "category" || key === "children") continue;
        columnKeySet.add(key);
      }
      if (props.children != null) hasDetailsColumn = true;
    }
  }

  const columnKeys = Array.from(columnKeySet);
  const isSimpleTwoColumn = !isExplicitMultiColumn && columnKeys.length === 0;

  return (
    // Allow the table to scroll horizontally on small viewports and prevent it
    // from forcing the page to a fixed wide layout.
    <div style={{ textAlign: "center", width: "100%", overflowX: "auto" }}>
      <table
        className="w-full text-sm my-6"
        style={{
          fontSize: "calc(1rem - 2pt)",
          border: `1px solid ${borderColor}`,
          borderRadius: "1rem",
          overflow: "hidden",
          backdropFilter: "blur(6px)",
          backgroundColor: tableBg,
          boxShadow,
          margin: "0 auto",
          maxWidth: "clamp(945px, 90vw, 1260px)",
          width: "100%",
          // When explicit column widths are provided, use fixed layout so
          // <col> widths are honored predictably by the browser.
          tableLayout:
            isExplicitMultiColumn && Array.isArray(columnWidths) ? "fixed" : "auto",
          wordBreak: "break-word",
        }}
      >
        {isExplicitMultiColumn && (
          // Render a colgroup that uses optional `columnWidths` (percent strings)
          // or falls back to equal share. When numeric percent widths are
          // provided, we can apply the `widenMiddleCols` multiplier and
          // normalize so that the widths sum to 100%.
          (() => {
            const count = cols.length;

            // Helper: check if an array of strings are all percent values.
            const allPercents = Array.isArray(columnWidths) && columnWidths.length === count && columnWidths.every((s) => typeof s === "string" && s.trim().endsWith("%"));

            if (allPercents) {
              // Parse numeric percent values
              const widths = columnWidths as string[];
              const numeric = widths.map((s) => Number.parseFloat(s));
              const base = [...numeric];

              if (widenMiddleCols && count >= 5) {
                const center = Math.floor(count / 2);
                const mids = [center - 1, center, center + 1];
                for (const i of mids) {
                  if (i >= 0 && i < count) base[i] = base[i] * 1.1;
                }
              }

              const sum = base.reduce((s, v) => s + v, 0) || 1;
              const normalized = base.map((v) => `${(v / sum) * 100}%`);
              return (
                <colgroup>
                  {normalized.map((w, i) => (
                    <col key={cols[i] ?? `c-${i}`} style={{ width: w }} />
                  ))}
                </colgroup>
              );
            }

            // Fallback: if columnWidths provided but not all percent values,
            // and length matches, render them verbatim; otherwise fall back
            // to equal share.
            if (Array.isArray(columnWidths) && columnWidths.length === count) {
              return (
                <colgroup>
                  {columnWidths.map((w, i) => (
                    <col key={cols[i] ?? `c-${i}`} style={{ width: w }} />
                  ))}
                </colgroup>
              );
            }

            // Default equal-share behavior (with optional widening)
            const base = new Array<number>(count).fill(100 / count);
            if (widenMiddleCols && count >= 5) {
              const center = Math.floor(count / 2);
              const mids = [center - 1, center, center + 1];
              for (const i of mids) {
                if (i >= 0 && i < count) base[i] = base[i] * 1.1;
              }
            }
            const sum = base.reduce((s, v) => s + v, 0);
            const normalized = base.map((v) => `${(v / sum) * 100}%`);
            return (
              <colgroup>
                {normalized.map((w, i) => (
                  <col key={cols[i] ?? `c-${i}`} style={{ width: w }} />
                ))}
              </colgroup>
            );
          })()
        )}
        {!hideHeader && (
          <thead>
            <tr
              style={{
                background: headerBg,
                color: headerText,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
                {isExplicitMultiColumn ? (
                // Explicit multi-column headers: use `cols` array as-is
                cols.map((col, idx) => (
                  <th
                    key={col ?? `c-${idx}`}
                    style={{
                      padding: "0.75rem 1.25rem",
                        textAlign: idx === 0 ? "center" : "left",
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: "0.02em",
                        borderRight:
                          idx === cols.length - 1
                            ? "0"
                            : `1px solid ${borderColor}`,
                        whiteSpace: "normal",
                    }}
                  >
                    {col}
                  </th>
                ))
              ) : (
                <>
                  {/* Legacy first column header */}
                  <th
                    style={{
                      padding: "0.75rem 1.25rem",
                      textAlign: "center",
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: "0.02em",
                      borderRight: `1px solid ${borderColor}`,
                      whiteSpace: "normal",
                    }}
                  >
                    {leftHeader}
                  </th>
                  {isSimpleTwoColumn ? (
                    <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide">
                      Details
                    </th>
                  ) : (
                    <>
                      {columnKeys.map((key, i) => (
                        <th
                          key={key}
                          style={{
                            padding: "0.75rem 1.25rem",
                            textAlign: "left",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            borderRight:
                              i === columnKeys.length - 1 && !hasDetailsColumn
                                ? "0"
                                : `1px solid ${borderColor}`,
                            whiteSpace: "normal",
                          }}
                        >
                          {formatHeader(key)}
                        </th>
                      ))}
                      {hasDetailsColumn && (
                        <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide">
                          Details
                        </th>
                      )}
                    </>
                  )}
                </>
              )}
            </tr>
          </thead>
        )}
        <tbody>
          {childArray.map((child, idx) => {
            const props = child.props || {};
            const p = props as unknown as Record<string, unknown>;
            const leftText = props.label ?? props.category ?? "";
            const values: React.ReactNode[] = (p.values as React.ReactNode[]) || [];
            const labelAlign = (p.alignLabel as React.CSSProperties["textAlign"]) || (p.alignCategory as React.CSSProperties["textAlign"]) || "center";
            const detailsAlign = (p.alignDetails as React.CSSProperties["textAlign"]) || "left";

            return (
              <tr
                key={`${leftText ? String(leftText) : 'row'}-${idx}`}
                style={{
                  transition: "background-color 160ms ease",
                  borderBottom: `1px solid ${borderColor}`,
                  outline: isDark
                    ? "1px solid rgba(255,255,255,0.03)"
                    : "1px solid rgba(0,0,0,0.02)",
                }}
              >
                {isExplicitMultiColumn ? (
                  // --- EXPLICIT MULTI-COLUMN MODE ---
                  <>
                    {/* First column: label */}
                    <td
                      style={{
                        padding: "0.75rem 1.25rem",
                        verticalAlign: "middle",
                        color: leftTextColor,
                        fontWeight: 600,
                        textAlign: labelAlign,
                        borderRight: `1px solid ${borderColor}`,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      {leftText}
                    </td>
                    {/* Remaining columns: values[i] for each header after the first */}
                    {cols.slice(1).map((_, colIdx) => (
                      <td
                        key={cols[colIdx + 1] ?? `c-${colIdx + 1}`}
                        style={{
                          padding: "0.75rem 1.25rem",
                          color: cellText,
                          textAlign: "left",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          borderRight:
                            colIdx === cols.length - 2
                              ? "0"
                              : `1px solid ${borderColor}`,
                        }}
                      >
                        {values[colIdx] ?? ""}
                      </td>
                    ))}
                  </>
                ) : (
                  // --- LEGACY / AUTO-COLUMN MODE ---
                  <>
                    <td
                      style={{
                        padding: "0.75rem 1.25rem",
                        verticalAlign: "middle",
                        color: leftTextColor,
                        fontWeight: 600,
                        textAlign: labelAlign,
                        borderRight: `1px solid ${borderColor}`,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      {leftText}
                    </td>
                    {isSimpleTwoColumn ? (
                      <td
                        style={{
                          padding: "0.75rem 1.25rem",
                          color: cellText,
                          textAlign: detailsAlign,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {(p.children as React.ReactNode)}
                      </td>
                    ) : (
                      <>
                        {columnKeys.map((key) => {
                          const alignKey = `align${key.charAt(0).toUpperCase()}${key.slice(1)}`;
                          const alignKeyVal = (p[alignKey] as React.CSSProperties["textAlign"]) || "left";
                          return (
                            <td
                              key={key}
                              style={{
                                padding: "0.75rem 1.25rem",
                                color: cellText,
                                  borderRight: `1px solid ${borderColor}`,
                                  textAlign: alignKeyVal,
                                  overflowWrap: "anywhere",
                                  wordBreak: "break-word",
                              }}
                            >
                              {(p[key] as React.ReactNode)}
                            </td>
                          );
                        })}
                        {hasDetailsColumn && (
                          <td
                            style={{
                              padding: "0.75rem 1.25rem",
                              color: cellText,
                              textAlign: detailsAlign,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {(p.children as React.ReactNode)}
                          </td>
                        )}
                      </>
                    )}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TechRow(_props: TechRowProps) {
  // This is a marker component used only for props; rendering is handled in TechTable.
  return null;
}
