import { defineConfig, s } from "velite";
import { remarkMdxPolicy } from "./lib/content/mdx-policy";

const post = {
  name: "Post",
  // Protected demo MDX is loaded separately at request time, never into public output.
  pattern: "posts/public/**/*.mdx",
  schema: s.object({
    title: s.string().min(1).max(120),
    slug: s.slug("posts"),
    date: s.isodate(),
    summary: s.string().min(1).max(240),
    category: s.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    tags: s.array(s.string().min(1)).min(1),
    cover: s.image(),
    content: s.mdx({
      outputFormat: "function-body",
      development: false,
      remarkPlugins: [remarkMdxPolicy],
      rehypePlugins: [],
      recmaPlugins: [],
    }),
  }),
};

export default defineConfig({
  root: "content",
  strict: true,
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { posts: post },
  mdx: {
    gfm: true,
    removeComments: true,
    copyLinkedFiles: true,
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkMdxPolicy],
    rehypePlugins: [],
    recmaPlugins: [],
  },
});
