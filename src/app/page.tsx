export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100 p-6">
      <div className="max-w-md w-full rounded-2xl bg-stone-800/80 border border-stone-700/60 p-8 shadow-2xl backdrop-blur text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Operacional
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-100">
          Veneza Brownies
        </h1>
        <p className="text-sm text-stone-400">
          Sistema de Gestão Comercial e Operacional inicializado com sucesso.
        </p>
        <div className="pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs text-stone-400">
          <span>Next.js 16 + Tailwind</span>
          <span className="text-emerald-400 font-medium">Ready for Vercel</span>
        </div>
      </div>
    </main>
  );
}
