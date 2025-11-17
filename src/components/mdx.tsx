// --- Restore missing MDX component creators ---
function createParagraph({ children }: { children: ReactNode }) {
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

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    // Use transliterate for slug generation
    const extractText = (node: any): string => {
      if (node === null || node === undefined || node === false) return "";
      if (typeof node === "string" || typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (typeof node === "object") {
        if (node.props && node.props.children) return extractText(node.props.children);
        return "";
      }
      return String(node);
    };
    const str = extractText(children);
    const strWithAnd = str.replace(/&/g, " and ");
    const slug = transliterate(strWithAnd, { lowercase: true, separator: "-" }).replace(/\-\-+/g, "-");
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };
  CustomHeading.displayName = `${as}`;
  return CustomHeading;
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    return null;
  }
  const { title: imgTitle, size, sizeMobile, sizeTablet, sizeDesktop, widthPercent, fullPage, ...restProps } = props as any;
  const caption = imgTitle || alt || null;

  // Responsive sizing props (percent values)
  const sizeVal = size ?? widthPercent ?? null; // base size percent
  const sizeMobileVal = sizeMobile ?? null; // percent for small screens
  const sizeTabletVal = sizeTablet ?? null; // percent for medium screens
  const sizeDesktopVal = sizeDesktop ?? null; // percent for large screens

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

  // Generate a unique class name for this image so we can inject scoped CSS
  const cls = `mdx-img-${Date.now().toString(36)}-${Math.floor(Math.random()*10000)}`;
  const css = `
    .${cls} { margin: 1rem 0; text-align: center; width: 100%; }
    .${cls} .mdx-img-inner { width: ${mobileUnit}; max-width: 100vw; margin-left: auto; margin-right: auto; display: block; }
    .${cls} img { width: 100%; height: auto; display: block; margin-left: auto; margin-right: auto; }
    @media (min-width: 640px) {
      .${cls} .mdx-img-inner { width: ${tabletUnit}; }
    }
    @media (min-width: 1024px) {
      .${cls} .mdx-img-inner { width: ${desktopUnit}; }
    }
  `;

  // Only forward a safe list of attributes to the <img> to avoid React warnings.
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

  let percentWidth = toPercent(sizeVal);
  if (!percentWidth) percentWidth = "100%";
  const figureStyle: React.CSSProperties = fullPageVal
    ? { position: "relative", left: "50%", transform: "translateX(-50%)", width: "100vw", margin: "1rem 0", display: "block", marginLeft: "auto", marginRight: "auto" }
    : { width: percentWidth, margin: "1rem 0", textAlign: "center", display: "block", marginLeft: "auto", marginRight: "auto" };

  const innerStyle: React.CSSProperties = fullPageVal
    ? { width: mobileUnit, maxWidth: "100vw", marginLeft: "auto", marginRight: "auto" }
    : { width: "100%", maxWidth: "100vw", marginLeft: "auto", marginRight: "auto" };

  return (
    <figure className={cls} style={figureStyle}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mdx-img-inner" style={innerStyle}>
        <img src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto", marginLeft: "auto", marginRight: "auto" }} {...safeProps} />
        {caption && (
          <figcaption style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", textAlign: "center" }}>{caption}</figcaption>
        )}
      </div>
    </figure>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createTableHeader({ children }: { children: ReactNode }) {
  return <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 'bold' }}>{children}</th>;
}

function createTableCell({ children }: { children: ReactNode }) {
  return <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{children}</td>;
}

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";
import { TechTable, TechRow } from "./TechTable";

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
    return null;
  }

  // Process headers
  const headerRows = React.Children.toArray(thead.props.children);
  const headerRow = headerRows[0] as TableElement;
  
  if (!headerRow) {
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
    <div style={{ overflowX: 'auto', marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-block', textAlign: 'left', width: '100%' }}>
        <Table
          data={{
            headers,
            rows
          }}
          style={{ margin: '0 auto' }}
        />
      </div>
    </div>
  );
}

function createTableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
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
  Image: createImage as any, // Allow <Image ... /> in MDX for custom props
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
  // Left-align all text by default, but center images/tables via their own wrappers
  return (
    <div style={{ textAlign: "left" }}>
      <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
    </div>
  );
}
