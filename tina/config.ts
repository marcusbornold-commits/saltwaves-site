import { defineConfig } from "tinacms";

const branch =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  process.env.GITHUB_REF_NAME ||
  "main";
const hasTinaCloudCredentials = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN
);

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  contentApiUrlOverride: hasTinaCloudCredentials
    ? undefined
    : "http://localhost:4001/graphql",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/blog",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
          },
          {
            type: "string",
            name: "date",
            label: "Date",
            description: "Use YYYY-MM-DD to match the current blog formatting.",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
