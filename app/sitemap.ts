import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const paths = ["", "/pricing", "/faq", "/privacy", "/terms", "/services", "/tjanster", "/founding", "/promptermaster", "/podcast-loudness-checker", "/blog"];
 const posts = await getAllPostsMeta();
 return [...paths, ...posts.map(p => `/blog/${p.slug}`)].map(path => ({ url: `https://saltwaves.studio${path || "/"}` }));
}
