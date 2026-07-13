import type { MDXComponents } from "mdx/types";
import BlogABPlayer from "@/app/components/blog-ab-player";

export const mdxComponents: MDXComponents = {
  ABPlayer: BlogABPlayer,
  h1: ({ children }) => (
    <h1 style={{ fontFamily: "var(--display)", fontWeight: 400 }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h3
      style={{
        fontFamily: "var(--display)",
        fontWeight: 400,
        marginTop: "1.5rem",
      }}
    >
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontFamily: "var(--display)",
        fontWeight: 400,
        marginTop: "1.2rem",
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      style={{
        fontFamily: "var(--body)",
        lineHeight: 1.7,
        marginTop: "0.75rem",
      }}
    >
      {children}
    </p>
  ),
};
