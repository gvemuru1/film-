export default function AboutPage() {
  return (
    <main className="flex-1 w-full">

      {/* ── Hero ── */}
      <section className="w-full px-6 pt-16 pb-12 border-b border-black/10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-black/30 font-light mb-4">
          / About
        </p>
        <h1 className="text-5xl sm:text-7xl font-extralight tracking-tight text-black leading-none max-w-4xl">
          What is Earth without art?<br />
          <span className="text-black/30">Just a rock.</span>
        </h1>
      </section>

      {/* ── Bio + Portrait ── */}
      <section className="w-full px-6 py-14 border-b border-black/10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Portrait placeholder */}
        <div className="aspect-[4/5] bg-black/5 rounded-xl overflow-hidden w-full max-w-sm mx-50">
          <img
            src="/gc.jpg"
            alt="Portrait"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio text */}
        <div className="flex flex-col gap-8 pt-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-3">/ Who</p>
            <p className="text-sm font-light text-black/70 leading-[1.9] max-w-md">
              GC, who thinks photography is art. I shoot on 35mm film. </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-3">/ Why Film</p>
            <p className="text-sm font-light text-black/70 leading-[1.9] max-w-md">
              Film slows me down. Film doesn't tolerate your mistakes. Film is harsh. Film is art.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-3">/ Process</p>
            <p className="text-sm font-light text-black/70 leading-[1.9] max-w-md">
              I shoot, send to the lab, scan, and curate. The edit happens in what I cut, not what I alter. What you see here is close to what came out of the canister.
            </p>
          </div>
        </div>
      </section>

      {/* ── Gear ── */}
      <section className="w-full px-6 py-14 border-b border-black/10">
        <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-8">/ Gear</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          {[
            { label: 'Camera', value: 'Richo KR-10' },
            { label: 'Film', value: 'Kodak Gold 200' },
            { label: 'Format', value: '35mm' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-1.5">{label}</p>
              <p className="text-sm font-light text-black leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="w-full px-6 py-14">
        <p className="text-[10px] uppercase tracking-widest text-black/25 font-light mb-6">/ Contact</p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: 'Email', href: 'gurucharanv@gmail.com', value: 'gurucharanv@gmail.com'
            },
            { label: 'Instagram', href: 'https://www.instagram.com/just.gc/', value: '@just.gc' },
          ].map(({ label, href, value }) => (
            <div key={label} className="flex items-baseline gap-4">
              <span className="text-[10px] uppercase tracking-widest text-black/25 font-light w-20 shrink-0">{label}</span>
              <a
                href={href}
                className="text-sm font-light text-black/60 hover:text-black transition-colors underline-offset-4 hover:underline"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
