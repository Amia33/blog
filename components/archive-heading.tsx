export function ArchiveHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-base-300/70 py-12 sm:py-16">
      <p className="text-xs tracking-[0.18em] text-base-content/55">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-base-content/65">
        {description}
      </p>
    </header>
  );
}
