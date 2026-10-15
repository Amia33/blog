type MdxNode = {
  type: string;
  name?: unknown;
  children?: MdxNode[];
  attributes?: Array<{ type: string; value?: unknown }>;
};

const allowedElements = new Set(["Details"]);

export const remarkMdxPolicy = () => (tree: MdxNode) => {
  const visit = (node: MdxNode) => {
    if (
      node.type === "mdxjsEsm" ||
      node.type === "mdxFlowExpression" ||
      node.type === "mdxTextExpression"
    ) {
      throw new Error(
        "MDX imports, exports, and JavaScript expressions are not allowed in blog content.",
      );
    }

    if (
      node.type === "mdxJsxFlowElement" ||
      node.type === "mdxJsxTextElement"
    ) {
      if (typeof node.name === "string" && !allowedElements.has(node.name)) {
        throw new Error(`The MDX component <${node.name}> is not supported.`);
      }

      if (
        node.attributes?.some(
          (attribute) =>
            attribute.type !== "mdxJsxAttribute" ||
            typeof attribute.value !== "string",
        )
      ) {
        throw new Error(
          "MDX component attributes must use static string values.",
        );
      }
    }

    node.children?.forEach(visit);
  };

  visit(tree);
};
