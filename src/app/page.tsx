import {
  applicationQuestions,
  memberStates,
  planTiers,
  qualitySignals,
  qssSteps,
} from "@/lib/qlub";

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(101,214,173,0.22),transparent_32%),radial-gradient(circle_at_78%_4%,rgba(243,201,105,0.16),transparent_25%),linear-gradient(145deg,#07100d_0%,#0d1713_42%,#14130f_100%)] text-[#f4f1e8]">
      <section className="mx-auto grid min-h-dvh w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] px-[clamp(16px,5vw,32px)] py-5 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="font-mono text-sm uppercase tracking-[0.18em] text-[#65d6ad]">
            QLUB
          </div>
          <div className="hidden items-center gap-2 text-sm text-[#a8b4a5] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#65d6ad]" />
            Private builder signal
          </div>
        </header>

        <div className="grid min-h-0 items-center gap-8 py-6 lg:grid-cols-[0.92fr_1fr] lg:py-8">
          <div className="max-w-3xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-[#f3c969]">
              Comunidad privada para gente que esta construyendo de verdad
            </p>
            <h1 className="text-balance text-[clamp(42px,7vw,76px)] font-semibold leading-[0.92]">
              Builders serios. Feedback real. Progreso visible.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-[clamp(16px,2vw,20px)] leading-7 text-[#c9d2c2]">
              QLUB filtra por evidencia, no por humo. Entras para aportar,
              publicar avances y recibir feedback de personas que tambien estan
              construyendo sistemas, productos o negocios.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#filtro"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#65d6ad] px-5 text-sm font-semibold text-[#07100d] shadow-[0_18px_55px_rgba(101,214,173,0.28)] transition hover:bg-[#7ce5be]"
              >
                Aplicar a QLUB
              </a>
              <a
                href="#planes"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--line)] px-5 text-sm font-semibold text-[#f4f1e8] transition hover:border-[#65d6ad]/70"
              >
                Ver planes
              </a>
            </div>
          </div>

          <div className="relative min-h-0">
            <div className="absolute -inset-6 rounded-[32px] bg-[#65d6ad]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[#0b1411]/86 p-4 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#7bb4d8]">
                  Quality filter
                </span>
                <span className="rounded-sm bg-[#f3c969]/15 px-2 py-1 font-mono text-xs text-[#f3c969]">
                  signal &gt; volume
                </span>
              </div>
              <div className="space-y-3" id="filtro">
                {applicationQuestions.map((question, index) => (
                  <div
                    key={question}
                    className="grid grid-cols-[34px_1fr] gap-3 rounded-lg border border-white/8 bg-white/[0.035] p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#65d6ad]/12 font-mono text-xs text-[#65d6ad]">
                      {index + 1}
                    </div>
                    <p className="min-w-0 text-sm leading-6 text-[#e8eddf]">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-[var(--line)] pt-4 md:grid-cols-4">
          {qssSteps.map((step) => (
            <div key={step.label} className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#65d6ad]">
                {step.label}
              </p>
              <p className="mt-1 text-sm leading-5 text-[#c9d2c2]">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-[clamp(16px,5vw,32px)] pb-14 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#f3c969]">
            Criterio de entrada
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            La comunidad se protege antes de crecer.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {qualitySignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <article
                key={signal.title}
                className="rounded-lg border border-[var(--line)] bg-white/[0.035] p-4"
              >
                <Icon className="mb-4 h-5 w-5 text-[#65d6ad]" aria-hidden />
                <h3 className="text-lg font-semibold">{signal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#a8b4a5]">
                  {signal.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="planes"
        className="mx-auto grid w-full max-w-7xl gap-4 px-[clamp(16px,5vw,32px)] pb-16 md:grid-cols-3"
      >
        {planTiers.map((plan) => (
          <article
            key={plan.name}
            className="rounded-lg border border-[var(--line)] bg-[#0b1411]/78 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#a8b4a5]">{plan.promise}</p>
              </div>
              <p className="font-mono text-sm text-[#f3c969]">{plan.price}</p>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-[#dce5d6]">
              {plan.features.map((feature) => (
                <li key={feature}>/ {feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-[clamp(16px,5vw,32px)] pb-20">
        <div className="grid gap-3 rounded-xl border border-[var(--line)] bg-[#f4f1e8] p-4 text-[#07100d] md:grid-cols-4">
          {memberStates.map((state) => (
            <div key={state.key} className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#315e4e]">
                {state.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#1a2a24]">
                {state.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
