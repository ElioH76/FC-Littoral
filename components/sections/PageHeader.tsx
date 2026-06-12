export function PageHeader({
  eyebrow,
  title,
  description,
  watermark,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  watermark?: string;
}) {
  const ghost = (watermark ?? eyebrow ?? title).toUpperCase();

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-ink text-bone">
      <div className="absolute inset-0 bg-gold-grain" aria-hidden />
      <span
        className="watermark absolute -right-4 bottom-0 text-[clamp(4rem,15vw,11rem)]"
        aria-hidden
      >
        {ghost}
      </span>

      <div className="container relative py-16 md:py-24">
        {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
        <h1 className="display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95]">
          {title}
        </h1>
        <span
          className="mt-6 block h-1.5 w-20 rounded-full bg-gradient-to-r from-gold to-violet"
          aria-hidden
        />
        {description && (
          <p className="mt-5 max-w-2xl text-bone-dim md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
