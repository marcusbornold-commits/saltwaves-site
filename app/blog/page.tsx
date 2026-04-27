import Link from "next/link";

import { getAllPostsMeta } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getAllPostsMeta();

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-24 text-white sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
        {posts.length === 0 ? (
          <p className="mt-6 text-white/70">No posts published yet.</p>
        ) : (
          <ul className="mt-10 space-y-7">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-white/15 pt-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-2xl font-semibold tracking-tight text-white transition-opacity hover:opacity-75"
                >
                  {post.title}
                </Link>
                {post.description ? (
                  <p className="mt-2 max-w-2xl text-white/70">{post.description}</p>
                ) : null}
                {post.date ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
