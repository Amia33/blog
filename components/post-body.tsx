import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { mdxComponents } from "@/mdx-components";

type Props = {
  code: string;
};

export async function PostBody({ code }: Props) {
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <div className="prose-content">
      <Content components={mdxComponents} />
    </div>
  );
}
