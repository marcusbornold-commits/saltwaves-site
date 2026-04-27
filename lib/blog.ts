import { compileMDX } from "next-mdx-remote/rsc";
import fs from "node:fs/promises";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  description?: string;
  date?: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
};

function stripExtension(fileName: string) {
  return fileName.replace(/\.mdx?$/, "");
}

function compareByDateDesc(a: BlogPostMeta, b: BlogPostMeta) {
  const aTs = a.date ? new Date(a.date).getTime() : 0;
  const bTs = b.date ? new Date(b.date).getTime() : 0;
  return bTs - aTs;
}

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const mdxFiles = entries.filter((entry) => entry.endsWith(".mdx"));
  const posts = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = stripExtension(fileName);
      const source = await fs.readFile(path.join(BLOG_DIR, fileName), "utf8");
      const { frontmatter } = await compileMDX<BlogFrontmatter>({
        source,
        options: { parseFrontmatter: true },
      });

      return {
        slug,
        title: frontmatter.title ?? slug,
        description: frontmatter.description,
        date: frontmatter.date,
      };
    })
  );

  return posts.sort(compareByDateDesc);
}

export async function getPostBySlug(slug: string) {
  const sourcePath = path.join(BLOG_DIR, `${slug}.mdx`);
  try {
    const source = await fs.readFile(sourcePath, "utf8");
    const { frontmatter, content } = await compileMDX<BlogFrontmatter>({
      source,
      options: { parseFrontmatter: true },
    });

    return {
      slug,
      frontmatter: {
        title: frontmatter.title ?? slug,
        description: frontmatter.description,
        date: frontmatter.date,
      },
      content,
    };
  } catch {
    return null;
  }
}
