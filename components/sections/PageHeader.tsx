export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-gold-grain" aria-hidden />
      <div className="container relative py-16 md:py-24">
        {eyebrow && (
          <span className="eyebrow text-gold">
            <span className="gold-rule !w-8" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-4xl leading-[1.02] md:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-white/75 md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
