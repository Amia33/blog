import assert from "node:assert/strict";
import test from "node:test";
import { remarkMdxPolicy } from "./mdx-policy.ts";

type Node = Parameters<ReturnType<typeof remarkMdxPolicy>>[0];

function validate(node: Node) {
  return () => remarkMdxPolicy()(node);
}

test("MDX policy accepts allowed components with static string attributes", () => {
  assert.doesNotThrow(
    validate({
      type: "root",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "Details",
          attributes: [{ type: "mdxJsxAttribute", value: "Summary" }],
        },
      ],
    }),
  );
});

test("MDX policy rejects JSX spread attributes", () => {
  assert.throws(
    validate({
      type: "root",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "Details",
          attributes: [{ type: "mdxJsxExpressionAttribute", value: "...x" }],
        },
      ],
    }),
    /static string values/,
  );
});

test("MDX policy rejects expression-valued JSX attributes", () => {
  assert.throws(
    validate({
      type: "root",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "Details",
          attributes: [
            {
              type: "mdxJsxAttribute",
              value: { type: "mdxJsxAttributeValueExpression" },
            },
          ],
        },
      ],
    }),
    /static string values/,
  );
});
