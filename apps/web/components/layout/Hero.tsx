interface HeroProps {
  title:    React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
}

export default function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden px-6 py-20 text-center"
      style={{
        background: 'linear-gradient(135deg,#274c77 0%,#1e3a5f 60%,#6096ba 100%)',
      }}
    >
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-8 gap-4 w-full h-full rotate-12 scale-150">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl" />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <span className="inline-block bg-white/10 text-white/80 text-xs
          font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
          Plateforme SaaS de gestion d&apos;équipements
        </span>

        <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
          {title}
        </h1>

        <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {children && (
          <div className="flex flex-col items-center gap-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}