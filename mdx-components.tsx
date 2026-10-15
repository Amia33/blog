function Details({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="my-6 rounded-xl border border-base-300 bg-base-200/50 p-4">
      <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        {summary}
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export const mdxComponents = {
  Details,
};
