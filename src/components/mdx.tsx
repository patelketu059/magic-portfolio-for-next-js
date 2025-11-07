import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";

import {
  Heading,
  HeadingLink,
  Text,
  InlineCode,
  CodeBlock,
  TextProps,
  MediaProps,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  List,
  ListItem,
  Line,
} from "@once-ui-system/core";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

let __mdxImageId = 0;

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }
  // Extract custom sizing props and title (caption) so they are NOT passed
  // through to the underlying <img> element (React warns for unknown DOM attrs).
  const {
    title: imgTitle,
    size,
    sizeMobile,
    sizeTablet,
    sizeDesktop,
    widthPercent,
    fullPage,
    ...restProps
  } = props as any;

  // Render a centered figure with caption. If the MDX image provides a
  // `title` prop we use that as caption, otherwise fall back to the alt text.
  const caption = imgTitle || alt || null;

  // Responsive sizing props (percent values)
  const sizeVal = size ?? widthPercent ?? null; // base size percent
  const sizeMobileVal = sizeMobile ?? null; // percent for small screens
  const sizeTabletVal = sizeTablet ?? null; // percent for medium screens
  const sizeDesktopVal = sizeDesktop ?? null; // percent for large screens

  // Generate a unique class name for this image so we can inject scoped CSS
  __mdxImageId += 1;
  const cls = `mdx-img-${Date.now().toString(36)}-${__mdxImageId}`;

  // Helper to normalize percent values (accept '70%', '70', 70)
  const toPercent = (v: any) => {
    if (v == null) return null;
    if (typeof v === "string") {
      if (v.trim().endsWith("%")) return v.trim();
      const n = Number(v);
      return Number.isNaN(n) ? null : `${n}%`;
    }
    if (typeof v === "number") return `${v}%`;
    return null;
  };

  const basePct = toPercent(sizeVal);
  const mobilePct = toPercent(sizeMobileVal) ?? basePct ?? "100%";
  const tabletPct = toPercent(sizeTabletVal) ?? basePct ?? mobilePct;
  const desktopPct = toPercent(sizeDesktopVal) ?? basePct ?? tabletPct;

  const fullPageVal = !!fullPage;
  // If fullPage is requested, interpret percentage values as viewport width (vw)
  const toVW = (pct: string | null) => (pct ? pct.replace(/%$/, "vw") : null);
  const mobileUnit = fullPageVal ? toVW(mobilePct) ?? mobilePct : mobilePct;
  const tabletUnit = fullPageVal ? toVW(tabletPct) ?? tabletPct : tabletPct;
  const desktopUnit = fullPageVal ? toVW(desktopPct) ?? desktopPct : desktopPct;

  const css = `
    .${cls} { margin: 1rem 0; text-align: center; display: flex; justify-content: center; width: 100%; }
    .${cls} .mdx-img-inner { width: ${mobileUnit}; max-width: 100%; margin: 0 auto; display: block; }
    .${cls} .mdx-img-inner > * { margin-left: auto !important; margin-right: auto !important; max-width: 100%; box-sizing: border-box; }
    .${cls} img { width: 100%; height: auto; display: block; }
    @media (min-width: 640px) {
      .${cls} .mdx-img-inner { width: ${tabletUnit}; }
    }
    @media (min-width: 1024px) {
      .${cls} .mdx-img-inner { width: ${desktopUnit}; }
    }
  `;

  // Only forward a safe list of attributes to the <img> to avoid React warnings.
  // Build safeProps from the original props object while explicitly
  // excluding known custom MDX sizing props so nothing like `sizeMobile`
  // can leak into DOM elements.
  const safeAttrNames = new Set([
    "loading",
    "decoding",
    "width",
    "height",
    "sizes",
    "srcSet",
    "className",
    "style",
    "id",
    "ref",
    "role",
    "aria-label",
    "aria-hidden",
    "title",
  ]);

  const forbiddenNames = new Set(["size", "sizeMobile", "sizeTablet", "sizeDesktop", "widthPercent", "fullPage", "title"]);

  const safeProps: Record<string, any> = {};
  Object.keys(props as any).forEach((k) => {
    if (forbiddenNames.has(k)) return;
    if (safeAttrNames.has(k)) safeProps[k] = (props as any)[k];
  });

  // Figure/style adjustments to allow full-page centering fallback
  const figureStyle: React.CSSProperties = fullPageVal
    ? { position: "relative", left: "50%", transform: "translateX(-50%)", width: "100vw", margin: "1rem 0" }
    : { display: "flex", justifyContent: "center", width: "100%", margin: "1rem 0" };

  const innerStyle: React.CSSProperties = fullPageVal
    ? { width: mobileUnit, maxWidth: "100%", margin: "0 auto" }
    : { width: mobilePct, maxWidth: "100%", margin: "0 auto" };

  return (
    <figure className={cls} style={figureStyle}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mdx-img-inner" style={innerStyle}>
        {/* Use a plain img element for MDX images to avoid wrapper complexity from the Media component */}
        <img src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto" }} {...safeProps} />
        {caption && (
          <figcaption style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", textAlign: "center" }}>{caption}</figcaption>
        )}
      </div>
    </figure>
  );
}

function slugify(input: React.ReactNode): string {
  // Safely extract text from a ReactNode (string, number, array, element)
  function extractText(node: any): string {
    if (node === null || node === undefined || node === false) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (typeof node === "object") {
      // React element with props.children
      if (node.props && node.props.children) return extractText(node.props.children);
      return "";
    }
    return String(node);
  }

  const str = extractText(input);
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }

  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

function createList({ children }: { children: ReactNode }) {
  return <List>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}

interface TableElement extends React.ReactElement {
  props: {
    children?: React.ReactNode;
  };
  type: string;
}

function createTable({ children }: { children: ReactNode }) {
  const childArray = React.Children.toArray(children);
  
  // Find thead and tbody elements
  const thead = childArray.find((child): child is TableElement => 
    typeof child === 'object' && 'type' in child && child.type === 'thead'
  );
  const tbody = childArray.find((child): child is TableElement => 
    typeof child === 'object' && 'type' in child && child.type === 'tbody'
  );

  if (!thead || !tbody) {
    console.error('Table structure is incomplete');
    return null;
  }

  // Process headers
  const headerRows = React.Children.toArray(thead.props.children);
  const headerRow = headerRows[0] as TableElement;
  
  if (!headerRow) {
    console.error('No header row found');
    return null;
  }

  const headers = React.Children.toArray(headerRow.props.children).map((th, index) => {
    const header = th as TableElement;
    return {
      content: header.props.children,
      key: `col-${index}`,
      sortable: false
    };
  });

  // Process body rows
  const rows = React.Children.toArray(tbody.props.children).map((tr) => {
    const row = tr as TableElement;
    return React.Children.toArray(row.props.children).map((td) => {
      const cell = td as TableElement;
      return cell.props.children;
    });
  });

  return (
    <div style={{ overflowX: 'auto', marginTop: '1rem', marginBottom: '1rem' }}>
      <Table
        data={{
          headers,
          rows
        }}
      />
    </div>
  );
}

function createTableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

function createTableCell({ children }: { children: ReactNode }) {
  return <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{children}</td>;
}

function createTableHeader({ children }: { children: ReactNode }) {
  return <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 'bold' }}>{children}</th>;
}


/* ---------------- TechTable + TechRow (auto-detect, white outline) ---------------- */

type TechTableProps = {
  children: React.ReactNode;
  /** Optional override for first column header (default: "Label") */
  leftHeader?: string;
  /** If true, hide the header row completely */
  hideHeader?: boolean;
};

type TechRowProps = {
  /** First column text (alias: `category`) */
  label?: string;
  category?: string;
  /** Arbitrary extra props become columns (e.g. dataset, fid, observations) */
  [key: string]: any;
};

function formatHeader(key: string): string {
  // Special case if you want to tweak some labels
  if (key.toLowerCase() === "fid") return "FID ↓";

  // Turn "datasetName" -> "Dataset Name"
  const withSpaces = key.replace(/([A-Z])/g, " $1");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function TechTable({ children, leftHeader = "Label", hideHeader = false }: TechTableProps) {
  const childArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TechRowProps>[];

  // Collect all custom keys used in TechRow props (except label/category/children)
  const columnKeySet = new Set<string>();
  let hasDetailsColumn = false;

  for (const child of childArray) {
    const props = child.props || {};
    Object.keys(props).forEach((key) => {
      if (key === "label" || key === "category" || key === "children") return;
      columnKeySet.add(key);
    });
    if (props.children != null) hasDetailsColumn = true;
  }

  const columnKeys = Array.from(columnKeySet);
  // If there are *no* extra props, we use the classic 2-column layout: Label + Details
  const isSimpleTwoColumn = columnKeys.length === 0;

  return (
    <table
      className="w-full text-sm my-6"
      style={{
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "1rem",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255,255,255,0.02)",
        boxShadow: "0 0 25px rgba(255,255,255,0.1)",
      }}
    >
      {!hideHeader && (
        <thead>
          <tr
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <th
              style={{
                padding: "0.75rem 1.25rem",
                textAlign: "center",
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "0.02em",
                borderRight: "1px solid rgba(255,255,255,0.3)",
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
                      borderRight: i === columnKeys.length - 1 && !hasDetailsColumn ? "0" : "1px solid rgba(255,255,255,0.15)",
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
          </tr>
          </thead>
      )}

      <tbody>
        {childArray.map((child, idx) => {
          const props = child.props || {};
          const leftText = props.label ?? props.category ?? "";

          return (
            <tr
              key={idx}
              style={{
                transition: "background-color 160ms ease",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                outline: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <td
                style={{
                  padding: "0.75rem 1.25rem",
                  verticalAlign: "middle",
                  color: "white",
                  fontWeight: 600,
                  textAlign: "center",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                {leftText}
              </td>

              {isSimpleTwoColumn ? (
                <td style={{ padding: "0.75rem 1.25rem", color: "rgba(255,255,255,0.9)" }}>{props.children}</td>
              ) : (
                <>
                  {columnKeys.map((key) => (
                    <td
                      key={key}
                      style={{
                        padding: "0.75rem 1.25rem",
                        color: "rgba(255,255,255,0.9)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {props[key]}
                    </td>
                  ))}
                  {hasDetailsColumn && (
                    <td style={{ padding: "0.75rem 1.25rem", color: "rgba(255,255,255,0.9)" }}>{props.children}</td>
                  )}
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// TechRow is just a "data holder" – TechTable reads its props and renders real <tr>/<td>s
function TechRow(_props: TechRowProps) {
  return null;
}



const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ol: createList as any,
  ul: createList as any,
  li: createListItem as any,
  hr: createHR as any,
  table: createTable as any,
  thead: ({ children }: { children: ReactNode }) => <thead>{children}</thead>,
  tbody: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,
  tr: createTableRow as any,
  th: createTableHeader as any,
  td: createTableCell as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  TechTable,
  TechRow,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
