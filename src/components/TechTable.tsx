"use client";
import React from "react";
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
};

export type TechRowProps = {
  label?: string;
  category?: string;
  /**
   * Optional array of values for explicit multi-column mode.
   * In that mode, a row is rendered as: [label, ...values].
   */
  values?: React.ReactNode[];
  [key: string]: any;
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

  // Legacy / auto-column detection (only used when NOT in explicit mode)
  const columnKeySet = new Set<string>();
  let hasDetailsColumn = false;

  if (!isExplicitMultiColumn) {
    for (const child of childArray) {
      const props = child.props || {};
      Object.keys(props).forEach((key) => {
        if (key === "label" || key === "category" || key === "children") return;
        columnKeySet.add(key);
      });
      if (props.children != null) hasDetailsColumn = true;
    }
  }

  const columnKeys = Array.from(columnKeySet);
  const isSimpleTwoColumn = !isExplicitMultiColumn && columnKeys.length === 0;

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <table
        className="w-full text-sm my-6"
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: "1rem",
          overflow: "hidden",
          backdropFilter: "blur(6px)",
          backgroundColor: tableBg,
          boxShadow,
          margin: "0 auto",
          maxWidth: "clamp(720px, 70vw, 1000px)",
          width: "100%",
        }}
      >
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
                // Explicit multi-column headers: use `columns` array as-is
                columns!.map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: "0.75rem 1.25rem",
                      textAlign: idx === 0 ? "center" : "left",
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: "0.02em",
                      borderRight:
                        idx === columns!.length - 1
                          ? "0"
                          : `1px solid ${borderColor}`,
                      whiteSpace: "nowrap",
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
            const leftText = props.label ?? props.category ?? "";
            const values: React.ReactNode[] = props.values || [];

            return (
              <tr
                key={idx}
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
                        textAlign:
                          props.alignLabel || props.alignCategory || "center",
                        borderRight: `1px solid ${borderColor}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {leftText}
                    </td>
                    {/* Remaining columns: values[i] for each header after the first */}
                    {columns!.slice(1).map((_, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          padding: "0.75rem 1.25rem",
                          color: cellText,
                          textAlign: "left",
                          borderRight:
                            colIdx === columns!.length - 2
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
                        textAlign:
                          props.alignLabel || props.alignCategory || "center",
                        borderRight: `1px solid ${borderColor}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {leftText}
                    </td>
                    {isSimpleTwoColumn ? (
                      <td
                        style={{
                          padding: "0.75rem 1.25rem",
                          color: cellText,
                          textAlign: props.alignDetails || "left",
                        }}
                      >
                        {props.children}
                      </td>
                    ) : (
                      <>
                        {columnKeys.map((key) => {
                          const alignKey = `align${key
                            .charAt(0)
                            .toUpperCase()}${key.slice(1)}`;
                          return (
                            <td
                              key={key}
                              style={{
                                padding: "0.75rem 1.25rem",
                                color: cellText,
                                borderRight: `1px solid ${borderColor}`,
                                textAlign: props[alignKey] || "left",
                              }}
                            >
                              {props[key]}
                            </td>
                          );
                        })}
                        {hasDetailsColumn && (
                          <td
                            style={{
                              padding: "0.75rem 1.25rem",
                              color: cellText,
                              textAlign: props.alignDetails || "left",
                            }}
                          >
                            {props.children}
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
