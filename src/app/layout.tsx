import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";

import {
  Background,
  Column,
  Flex,
  Meta,
  opacity,
  RevealFx,
  SpacingToken,
} from "@once-ui-system/core";
import { Header, RouteGuard, Providers } from "@/components";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { baseURL, effects, fonts, style, dataStyle, home } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      dir="ltr"
      translate="no"
      style={{ scrollBehavior: "smooth" }}
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
        "notranslate",
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="notranslate" />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'dark';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme (fall back to configured defaultTheme)
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme || defaultTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        
        {/* Remove common browser-extension attributes (e.g. Grammarly) before hydration to avoid SSR/CSR mismatches */}
        <script
          id="strip-extension-attrs"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  // Common extension attributes and patterns to remove
                  var attrs = [
                    'data-new-gr-c-s-check-loaded',
                    'data-gr-ext-installed',
                    'data-gramm',
                    'data-gramm_id'
                  ];
                  attrs.forEach(function(a){
                    try { document.documentElement.removeAttribute(a); } catch(e) {}
                    try { if (document.body) document.body.removeAttribute(a); } catch(e) {}
                  });

                  // Remove any attributes starting with data-gr* on html/body
                  try {
                    var el = document.documentElement;
                    if (el && el.attributes) {
                      Array.prototype.slice.call(el.attributes).forEach(function(at){
                        if (/^data-gr/i.test(at.name)) {
                          try { el.removeAttribute(at.name); } catch(e){}
                        }
                      });
                    }
                    var b = document.body;
                    if (b && b.attributes) {
                      Array.prototype.slice.call(b.attributes).forEach(function(at){
                        if (/^data-gr/i.test(at.name)) {
                          try { b.removeAttribute(at.name); } catch(e){}
                        }
                      });
                    }
                  } catch(e){}
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <body suppressHydrationWarning
          style={{ 
            minHeight: "100vh",
            margin: 0,
            padding: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div style={{ position: "absolute", width: "100%", height: "100%" }}>
            <Background
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
          </div>
          <div style={{ width: "100%", minHeight: "16px" }} className="mobile-spacer" />
          <Header />
            <div style={{ 
              zIndex: 0, 
              width: "100%", 
              padding: "var(--static-space-24)", 
              display: "flex",
              justifyContent: "center",
              flex: 1
            }}>
            <div className="site-container" style={{ 
              display: "flex",
              justifyContent: "center",
              width: "100%",
              minHeight: 0
            }}>
              <RouteGuard>{children}</RouteGuard>
            </div>
          </div>
          <ScrollToTopButton />
          <div className="bottom-spacer" aria-hidden="true" />
        </body>
      </Providers>
    </html>
  );
}
