import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getAllPostsMeta, getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Post not found | Saltwaves Studio",
    };
  }

  return {
    title: `${post.frontmatter.title} | Saltwaves Studio`,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] px-6 py-24 text-[#f1ede8] sm:px-10 lg:px-20">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.16em] text-[#f1ede8]/60 transition-opacity hover:opacity-75"
        >
          Back to blog
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.date ? (
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#f1ede8]/50">
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
        {post.frontmatter.description ? (
          <p className="mt-8 text-xl text-[#f1ede8]/75">{post.frontmatter.description}</p>
        ) : null}
        <div className="blog-content mt-10">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 style={{ fontFamily: "var(--display)", fontWeight: 400 }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    fontFamily: "var(--display)",
                    fontWeight: 400,
                    marginTop: "1.5rem",
                  }}
                >
                  {children}
                </h2>
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
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
