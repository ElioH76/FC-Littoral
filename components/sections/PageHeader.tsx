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
    <section className="edge-slant-b relative isolate overflow-hidden bg-ink text-white">
      {/* Couches d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-700/40 via-ink to-ink" aria-hidden />
      <div className="absolute inset-0 bg-gold-grain" aria-hidden />
      <div className="absolute inset-0 bg-pinstripe opacity-60" aria-hidden />

      {/* Mot filigrane géant */}
      <span
        className="watermark watermark-light -right-4 bottom-2 text-[5.5rem] sm:text-[8rem] md:text-[11rem]"
        aria-hidden
      >
        {ghost}
      </span>

      <div className="container relative pb-20 pt-16 md:pb-28 md:pt-24">
        {eyebrow && <span className="kicker kicker-light">{eyebrow}</span>}
        <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] md:text-7xl">
          {title}
        </h1>
        <span className="mt-6 block h-1 w-20 rounded-full bg-gradient-to-r from-gold to-gold-600" aria-hidden />
        {description && (
          <p className="mt-6 max-w-2xl text-white/75 md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
