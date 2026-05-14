"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Gauge,
  LockKeyhole,
  MessageSquareText,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { applyToQlub, type ApplyToQlubState } from "@/app/actions/apply-to-qlub";
import {
  decisionCopy,
  type ApplicationField,
  type ApplicationInput,
} from "@/lib/application";

type IntroScreen = {
  eyebrow: string;
  title: string;
  body: string;
  icon: typeof Radar;
  visual: "impact" | "problem" | "mechanism" | "proof";
};

type QuestionStep = {
  field: ApplicationField;
  eyebrow: string;
  title: string;
  helper: string;
  placeholder: string;
  minLength: number;
};

const introScreens: IntroScreen[] = [
  {
    eyebrow: "Impacto",
    title: "Entra solo si estas construyendo algo comprobable.",
    body: "QLUB no filtra por seguidores ni por promesas. Filtra por evidencia, claridad y capacidad de aportar feedback util.",
    icon: Radar,
    visual: "impact",
  },
  {
    eyebrow: "Problema",
    title: "Las comunidades grandes castigan la senal.",
    body: "Si cualquiera entra, los builders serios dejan de pedir feedback. El costo real es perder criterio, tiempo y foco.",
    icon: CircleAlert,
    visual: "problem",
  },
  {
    eyebrow: "Mecanismo",
    title: "Aplicacion corta, scoring visible y revision manual.",
    body: "Primero pruebas que existe un proyecto. Luego defines que feedback necesitas. Despues muestras que puedes aportar a otros.",
    icon: Gauge,
    visual: "mechanism",
  },
  {
    eyebrow: "Prueba",
    title: "El filtro mide lo que sostiene la comunidad.",
    body: "Proyecto real, evidencia, pedido claro, reciprocidad y momento. La salida no es un premio: es el siguiente nivel de revision.",
    icon: ClipboardCheck,
    visual: "proof",
  },
];

const questionSteps: QuestionStep[] = [
  {
    field: "building",
    eyebrow: "Filtro 1/5",
    title: "Que estas construyendo y para quien?",
    helper: "Describe el producto, sistema o negocio. Incluye usuario, problema y estado actual.",
    placeholder:
      "Ej: Estoy construyendo un sistema de reservas para clinicas pequenas que pierden leads por WhatsApp...",
    minLength: 40,
  },
  {
    field: "evidence",
    eyebrow: "Filtro 2/5",
    title: "Que evidencia puedes mostrar hoy?",
    helper: "Demo, landing, usuarios, clientes, capturas, repositorio, ventas o aprendizajes medibles.",
    placeholder:
      "Ej: Tengo landing publicada, 18 leads, 3 demos agendadas y capturas del dashboard...",
    minLength: 20,
  },
  {
    field: "feedbackNeed",
    eyebrow: "Filtro 3/5",
    title: "Que decision necesitas destrabar con feedback?",
    helper: "Pide una decision concreta. No busques aplausos ni opiniones generales.",
    placeholder:
      "Ej: Necesito saber si el onboarding explica bien el valor antes de pedir pago...",
    minLength: 20,
  },
  {
    field: "feedbackCapacity",
    eyebrow: "Filtro 4/5",
    title: "Que feedback puedes dar a otros builders?",
    helper: "Menciona areas donde tienes criterio real: ventas, UX, copy, codigo, ops, pricing.",
    placeholder:
      "Ej: Puedo revisar funnels, claridad de oferta, conversion, automatizaciones y flujos de venta...",
    minLength: 20,
  },
  {
    field: "whyNow",
    eyebrow: "Filtro 5/5",
    title: "Por que QLUB deberia darte acceso ahora?",
    helper: "Explica por que este momento importa y que haras con el feedback recibido.",
    placeholder:
      "Ej: Estoy cerrando la primera version pagada y necesito feedback antes de lanzar a 50 leads...",
    minLength: 20,
  },
];

const initialAnswers: ApplicationInput = {
  builderName: "",
  email: "",
  building: "",
  evidence: "",
  feedbackNeed: "",
  feedbackCapacity: "",
  whyNow: "",
};

const initialActionState: ApplyToQlubState = {
  ok: false,
  message: "",
};

const orderedFields: ApplicationField[] = [
  "building",
  "evidence",
  "feedbackNeed",
  "feedbackCapacity",
  "whyNow",
  "builderName",
  "email",
];

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function progressPercent(activeIndex: number, totalScreens: number) {
  return Math.round(((activeIndex + 1) / totalScreens) * 100);
}

function VisualPanel({ type }: { type: IntroScreen["visual"] }) {
  if (type === "problem") {
    return (
      <div className="space-y-3">
        {[
          ["Ruido", "Aplicantes sin proyecto real"],
          ["Costo", "Feedback superficial y decisiones lentas"],
          ["Filtro", "Evidencia antes de acceso"],
        ].map(([label, text]) => (
          <div
            key={label}
            className="grid grid-cols-[72px_1fr] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="font-mono text-xs uppercase text-[#f3c969]">
              {label}
            </span>
            <span className="text-sm leading-5 text-[#dce5d6]">{text}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "mechanism") {
    return (
      <div className="grid gap-3">
        {[
          ["01", "Prueba proyecto", "Que existe, para quien y en que estado."],
          ["02", "Pide decision", "Que quieres destrabar con feedback."],
          ["03", "Aporta senal", "Que puedes revisar en otros proyectos."],
        ].map(([step, title, body]) => (
          <div key={step} className="grid grid-cols-[40px_1fr] gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#65d6ad]/14 font-mono text-xs text-[#65d6ad]">
              {step}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#f4f1e8]">
                {title}
              </span>
              <span className="mt-0.5 block text-sm leading-5 text-[#a8b4a5]">
                {body}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "proof") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          ["30", "Evidencia"],
          ["24", "Proyecto"],
          ["24", "Reciprocidad"],
          ["22", "Pedido claro"],
        ].map(([score, label]) => (
          <div key={label} className="rounded-md bg-white/[0.045] p-3">
            <span className="font-mono text-2xl font-semibold text-[#65d6ad]">
              {score}
            </span>
            <span className="mt-1 block text-xs uppercase text-[#a8b4a5]">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-[150px] overflow-hidden rounded-lg bg-[#07100d] p-3 sm:min-h-[180px] sm:p-4">
      <div className="absolute inset-x-6 top-8 h-24 rounded-full bg-[#65d6ad]/25 blur-3xl" />
      <div className="relative grid min-h-[150px] grid-rows-[1fr_auto] sm:min-h-[180px]">
        <div className="grid place-items-center">
          <div className="relative h-24 w-24 rounded-full border border-[#65d6ad]/45 bg-[#65d6ad]/10 shadow-[0_0_80px_rgba(101,214,173,0.28)] sm:h-28 sm:w-28">
            <div className="absolute inset-5 rounded-full border border-[#f3c969]/50" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#65d6ad]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {["Evidencia", "Feedback", "Acceso"].map((item) => (
            <span
              key={item}
              className="rounded-sm border border-white/10 bg-white/[0.04] px-2 py-2 text-xs text-[#dce5d6]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ state }: { state: ApplyToQlubState }) {
  if (!state.result) return null;

  const copy = decisionCopy[state.result.decision];

  return (
    <section className="grid min-h-0 gap-4 lg:grid-cols-[0.92fr_1fr] lg:items-center">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#65d6ad]">
          Resultado
        </p>
        <h1 className="mt-3 text-balance text-[clamp(34px,8vw,68px)] font-semibold leading-[0.95]">
          {copy.label}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[#c9d2c2] md:text-lg">
          {copy.body}
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-[#f3c969]">
          ID: {state.submissionId}
        </p>
      </div>

      <div className="min-h-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[#0b1411]/86 p-4 shadow-2xl shadow-black/35">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[#f4f1e8]">
            Score de entrada
          </span>
          <span className="font-mono text-3xl font-semibold text-[#65d6ad]">
            {state.result.score}
          </span>
        </div>
        <div className="space-y-2">
          {state.result.breakdown.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between gap-3 text-xs">
                <span className="text-[#dce5d6]">{item.label}</span>
                <span className="font-mono text-[#a8b4a5]">
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[#65d6ad]"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase text-[#65d6ad]">Senales</p>
            <ul className="space-y-1 text-sm leading-5 text-[#dce5d6]">
              {state.result.strengths.map((item) => (
                <li key={item}>/ {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase text-[#f3c969]">Ajustes</p>
            <ul className="space-y-1 text-sm leading-5 text-[#dce5d6]">
              {state.result.gaps.map((item) => (
                <li key={item}>/ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ApplicationFunnel() {
  const [answers, setAnswers] = useState<ApplicationInput>(initialAnswers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedSubmissionId, setDismissedSubmissionId] = useState<
    string | undefined
  >();
  const [state, formAction, isPending] = useActionState(
    applyToQlub,
    initialActionState,
  );

  const showResult = Boolean(
    state.ok &&
      state.result &&
      state.submissionId &&
      state.submissionId !== dismissedSubmissionId,
  );
  const totalScreens = introScreens.length + questionSteps.length + 1;
  const questionIndex = activeIndex - introScreens.length;
  const activeQuestion = questionSteps[questionIndex];
  const isContactScreen = activeIndex === totalScreens - 1;
  const isIntroScreen = activeIndex < introScreens.length;
  const percent = progressPercent(activeIndex, totalScreens);

  const canAdvance = useMemo(() => {
    if (showResult) return false;
    if (isIntroScreen) return true;
    if (activeQuestion) {
      return answers[activeQuestion.field].trim().length >= activeQuestion.minLength;
    }

    return (
      answers.builderName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())
    );
  }, [activeQuestion, answers, isIntroScreen, showResult]);

  function updateAnswer(field: ApplicationField, value: string) {
    setAnswers((current) => ({ ...current, [field]: value }));
  }

  function goNext() {
    if (!canAdvance) return;
    setActiveIndex((current) => Math.min(current + 1, totalScreens - 1));
  }

  function goBack() {
    setDismissedSubmissionId(state.submissionId);
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function renderActiveScreen() {
    if (showResult && state.result) {
      return <ResultPanel state={state} />;
    }

    if (isIntroScreen) {
      const screen = introScreens[activeIndex];
      const Icon = screen.icon;

      return (
        <section className="grid min-h-0 gap-5 lg:grid-cols-[0.92fr_1fr] lg:items-center">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2">
              <Icon className="h-4 w-4 text-[#65d6ad]" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#f3c969]">
                {screen.eyebrow}
              </span>
            </div>
            <h1 className="text-balance text-[clamp(34px,8vw,70px)] font-semibold leading-[0.95]">
              {screen.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[#c9d2c2] md:text-lg">
              {screen.body}
            </p>
          </div>

          <div className="min-h-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[#0b1411]/86 p-4 shadow-2xl shadow-black/35 backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#7bb4d8]">
                Quality filter
              </span>
              <span className="rounded-sm bg-[#65d6ad]/12 px-2 py-1 font-mono text-xs text-[#65d6ad]">
                signal &gt; volume
              </span>
            </div>
            <VisualPanel type={screen.visual} />
          </div>
        </section>
      );
    }

    if (activeQuestion) {
      const value = answers[activeQuestion.field];
      const fieldError = state.fieldErrors?.[activeQuestion.field];

      return (
        <section className="grid min-h-0 gap-5 lg:grid-cols-[0.82fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3c969]">
              {activeQuestion.eyebrow}
            </p>
            <h1 className="mt-3 text-balance text-[clamp(32px,8vw,64px)] font-semibold leading-[0.96]">
              {activeQuestion.title}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#c9d2c2]">
              {activeQuestion.helper}
            </p>
          </div>

          <div className="min-h-0 rounded-xl border border-[var(--line)] bg-[#0b1411]/86 p-4 shadow-2xl shadow-black/35">
            <label
              htmlFor={activeQuestion.field}
              className="mb-3 block text-sm font-semibold text-[#f4f1e8]"
            >
              Respuesta
            </label>
            <textarea
              id={activeQuestion.field}
              value={value}
              onChange={(event) =>
                updateAnswer(activeQuestion.field, event.target.value)
              }
              placeholder={activeQuestion.placeholder}
              className="h-[min(30svh,240px)] min-h-36 w-full resize-none rounded-md border border-white/12 bg-[#07100d] px-4 py-3 text-sm leading-6 text-[#f4f1e8] outline-none transition placeholder:text-[#657066] focus:border-[#65d6ad]"
            />
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className={fieldError ? "text-[#f3c969]" : "text-[#a8b4a5]"}>
                {fieldError ?? `${countWords(value)} palabras registradas`}
              </span>
              <span className="font-mono text-[#65d6ad]">
                {Math.min(value.trim().length, activeQuestion.minLength)}/
                {activeQuestion.minLength}
              </span>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="grid min-h-0 gap-5 lg:grid-cols-[0.82fr_1fr] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3c969]">
            Captura
          </p>
          <h1 className="mt-3 text-balance text-[clamp(32px,8vw,64px)] font-semibold leading-[0.96]">
            Donde enviamos el resultado y la revision?
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#c9d2c2]">
            El scoring es inmediato. La entrada final queda sujeta a revision
            manual para proteger la calidad del grupo.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[#0b1411]/86 p-4 shadow-2xl shadow-black/35">
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-[#f4f1e8]">
              Nombre
              <input
                value={answers.builderName}
                onChange={(event) =>
                  updateAnswer("builderName", event.target.value)
                }
                className="h-12 rounded-md border border-white/12 bg-[#07100d] px-4 text-sm text-[#f4f1e8] outline-none transition placeholder:text-[#657066] focus:border-[#65d6ad]"
                placeholder="Tu nombre"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#f4f1e8]">
              Email
              <input
                type="text"
                inputMode="email"
                value={answers.email}
                onChange={(event) => updateAnswer("email", event.target.value)}
                className="h-12 rounded-md border border-white/12 bg-[#07100d] px-4 text-sm text-[#f4f1e8] outline-none transition placeholder:text-[#657066] focus:border-[#65d6ad]"
                placeholder="tu@email.com"
              />
            </label>
          </div>
          {state.message && !state.ok ? (
            <p className="mt-3 text-sm leading-5 text-[#f3c969]">
              {state.message}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(101,214,173,0.22),transparent_32%),radial-gradient(circle_at_78%_4%,rgba(243,201,105,0.16),transparent_25%),linear-gradient(145deg,#07100d_0%,#0d1713_42%,#14130f_100%)] text-[#f4f1e8] md:h-dvh">
      <form
        action={formAction}
        className="mx-auto grid h-full w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] px-[clamp(16px,5vw,28px)] py-4 md:py-7"
      >
        {orderedFields.map((field) => (
          <input key={field} type="hidden" name={field} value={answers[field]} />
        ))}

        <header className="flex shrink-0 items-center justify-between gap-4">
          <div>
            <div className="font-mono text-sm uppercase tracking-[0.18em] text-[#65d6ad]">
              QLUB
            </div>
            <div className="mt-1 hidden text-xs text-[#a8b4a5] sm:block">
              Private builder signal
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-white/10 sm:block">
              <div
                className="h-full rounded-full bg-[#65d6ad] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="rounded-sm border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-[#dce5d6]">
              {activeIndex + 1}/{totalScreens}
            </span>
          </div>
        </header>

        <div className="min-h-0 py-4 md:py-6">{renderActiveScreen()}</div>

        <footer className="shrink-0 pb-[env(safe-area-inset-bottom)]">
          <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/10 sm:hidden">
            <div
              className="h-full rounded-full bg-[#65d6ad] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={activeIndex === 0 && !showResult}
              className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--line)] text-[#f4f1e8] transition enabled:hover:border-[#65d6ad]/70 disabled:opacity-35"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>

            {showResult ? (
              <button
                type="button"
                onClick={() => {
                  setDismissedSubmissionId(state.submissionId);
                  setActiveIndex(introScreens.length);
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#65d6ad] px-5 text-sm font-semibold text-[#07100d] shadow-[0_18px_55px_rgba(101,214,173,0.28)] transition hover:bg-[#7ce5be]"
              >
                <MessageSquareText className="h-5 w-5" aria-hidden />
                Editar respuestas
              </button>
            ) : isContactScreen ? (
              <button
                type="submit"
                disabled={!canAdvance || isPending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#65d6ad] px-5 text-sm font-semibold text-[#07100d] shadow-[0_18px_55px_rgba(101,214,173,0.28)] transition enabled:hover:bg-[#7ce5be] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isPending ? (
                  <>
                    <Sparkles className="h-5 w-5" aria-hidden />
                    Evaluando
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                    Enviar aplicacion
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#65d6ad] px-5 text-sm font-semibold text-[#07100d] shadow-[0_18px_55px_rgba(101,214,173,0.28)] transition enabled:hover:bg-[#7ce5be] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Continuar
                <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#a8b4a5]">
            <LockKeyhole className="h-4 w-4 text-[#65d6ad]" aria-hidden />
            <span className="truncate">
              Revision manual antes de acceso privado
            </span>
            <ShieldCheck className="h-4 w-4 text-[#f3c969]" aria-hidden />
          </div>
        </footer>
      </form>
    </main>
  );
}
