"use client";

import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { applyToQlub, type ApplyToQlubState } from "@/app/actions/apply-to-qlub";
import {
  decisionCopy,
  type ApplicationField,
  type ApplicationInput,
} from "@/lib/application";

type LandingStep = {
  eyebrow: string;
  title: string;
  body: string;
  mode: "promise" | "cost" | "system" | "apply";
};

type QuestionStep = {
  field: ApplicationField;
  eyebrow: string;
  title: string;
  helper: string;
  placeholder: string;
  minLength: number;
  minWords: number;
  signals: string[];
  validationHint: string;
};

const landingSteps: LandingStep[] = [
  {
    eyebrow: "Para builders con algo real",
    title: "Entra a un circulo donde tu proyecto recibe criterio real.",
    body: "QLUB es una comunidad privada para builders que ya estan construyendo productos, sistemas o negocios. Entras por evidencia, no por promesas.",
    mode: "promise",
  },
  {
    eyebrow: "El costo de pedir feedback afuera",
    title: "Mas opiniones no significa mejor criterio.",
    body: "En grupos abiertos recibes respuestas sin contexto, consejos genericos y ruido. QLUB filtra antes de abrir acceso para proteger la calidad de cada conversacion.",
    mode: "cost",
  },
  {
    eyebrow: "Como funciona QLUB",
    title: "Aplicar, probar senal, aportar y recien pedir feedback.",
    body: "El sistema valida proyecto, evidencia, claridad del pedido y capacidad de ayudar a otros. Dentro, el loop es simple: das feedback util para ganar derecho a recibirlo.",
    mode: "system",
  },
  {
    eyebrow: "Entrada privada",
    title: "Si ya estas construyendo, desliza para aplicar.",
    body: "El filtro toma pocos minutos. Al final veras un estado inmediato y, si hay senal, pasas a revision manual.",
    mode: "apply",
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
    minWords: 12,
    signals: [
      "construy",
      "producto",
      "sistema",
      "app",
      "saas",
      "plataforma",
      "negocio",
      "servicio",
      "cliente",
      "usuario",
      "para",
      "problema",
      "ayuda",
    ],
    validationHint:
      "Menciona que construyes, para quien, y que problema o necesidad resuelve.",
  },
  {
    field: "evidence",
    eyebrow: "Filtro 2/5",
    title: "Que evidencia puedes mostrar hoy?",
    helper: "Demo, landing, usuarios, clientes, capturas, repositorio, ventas o aprendizajes medibles.",
    placeholder:
      "Ej: Tengo landing publicada, 18 leads, 3 demos agendadas y capturas del dashboard...",
    minLength: 20,
    minWords: 8,
    signals: [
      "demo",
      "landing",
      "usuario",
      "cliente",
      "captura",
      "screenshot",
      "github",
      "venta",
      "lead",
      "mrr",
      "beta",
      "prototipo",
      "link",
      "metric",
    ],
    validationHint:
      "Agrega evidencia concreta: demo, usuarios, leads, ventas, capturas, link o prototipo.",
  },
  {
    field: "feedbackNeed",
    eyebrow: "Filtro 3/5",
    title: "Que decision necesitas destrabar con feedback?",
    helper: "Pide una decision concreta. No busques aplausos ni opiniones generales.",
    placeholder:
      "Ej: Necesito saber si el onboarding explica bien el valor antes de pedir pago...",
    minLength: 20,
    minWords: 8,
    signals: [
      "decidir",
      "decision",
      "validar",
      "saber",
      "feedback",
      "pricing",
      "precio",
      "conversion",
      "copy",
      "ux",
      "onboarding",
      "venta",
      "lanzar",
    ],
    validationHint:
      "Formula una decision puntual que quieras destrabar con feedback.",
  },
  {
    field: "feedbackCapacity",
    eyebrow: "Filtro 4/5",
    title: "Que feedback puedes dar a otros builders?",
    helper: "Menciona areas donde tienes criterio real: ventas, UX, copy, codigo, ops, pricing.",
    placeholder:
      "Ej: Puedo revisar funnels, claridad de oferta, conversion, automatizaciones y flujos de venta...",
    minLength: 20,
    minWords: 8,
    signals: [
      "puedo",
      "ayudar",
      "revisar",
      "feedback",
      "copy",
      "ux",
      "codigo",
      "pricing",
      "ventas",
      "conversion",
      "producto",
      "automatizacion",
      "operacion",
    ],
    validationHint:
      "Di en que temas puedes dar feedback util a otros builders.",
  },
  {
    field: "whyNow",
    eyebrow: "Filtro 5/5",
    title: "Por que QLUB deberia darte acceso ahora?",
    helper: "Explica por que este momento importa y que haras con el feedback recibido.",
    placeholder:
      "Ej: Estoy cerrando la primera version pagada y necesito feedback antes de lanzar a 50 leads...",
    minLength: 20,
    minWords: 8,
    signals: [
      "ahora",
      "necesito",
      "lanzar",
      "cerrar",
      "validar",
      "clientes",
      "usuarios",
      "leads",
      "version",
      "pago",
      "antes",
      "esta semana",
    ],
    validationHint:
      "Explica por que este momento importa y que haras con el feedback.",
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

function hasLowTextQuality(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, "");
  if (normalized.length < 12) return true;

  const letters = normalized.match(/[a-záéíóúñ]/gi) ?? [];
  const uniqueLetters = new Set(letters.map((letter) => letter.toLowerCase()));
  const repeatedRun = /(.)\1{7,}/i.test(normalized);
  const letterRatio = letters.length / normalized.length;

  return repeatedRun || uniqueLetters.size < 6 || letterRatio < 0.65;
}

function validateQuestionAnswer(step: QuestionStep, value: string) {
  const trimmed = value.trim();
  const wordCount = countWords(trimmed);
  const normalized = trimmed.toLowerCase();
  const hasSignal = step.signals.some((signal) => normalized.includes(signal));

  if (trimmed.length < step.minLength || wordCount < step.minWords) {
    return {
      ok: false,
      message: `Necesito al menos ${step.minWords} palabras con contexto real.`,
    };
  }

  if (hasLowTextQuality(trimmed)) {
    return {
      ok: false,
      message: "Parece texto repetido o sin sentido. Escribe una respuesta real.",
    };
  }

  if (!hasSignal) {
    return {
      ok: false,
      message: step.validationHint,
    };
  }

  return { ok: true, message: "" };
}

function SwipeControl({
  label,
  disabled,
  busy,
  onComplete,
}: {
  label: string;
  disabled?: boolean;
  busy?: boolean;
  onComplete: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  function maxDrag(width = trackWidth) {
    return Math.max(0, width - 58);
  }

  function completeIfReady(nextX: number) {
    const max = maxDrag();

    if (max > 0 && nextX >= max * 0.72) {
      setDragX(max);
      window.setTimeout(() => {
        onComplete();
        setDragX(0);
      }, 120);
      return;
    }

    setDragX(0);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || busy) return;
    setTrackWidth(event.currentTarget.getBoundingClientRect().width);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || disabled || busy) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX = Math.min(
      Math.max(event.clientX - rect.left - 28, 0),
      maxDrag(rect.width),
    );
    setDragX(nextX);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    completeIfReady(dragX);
  }

  const max = maxDrag();
  const fill = max > 0 ? Math.min(100, (dragX / max) * 100) : 0;

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || busy}
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !disabled && !busy) {
          event.preventDefault();
          onComplete();
        }
      }}
      className={`relative h-14 select-none overflow-hidden rounded-full border border-white/12 bg-white/[0.07] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition ${
        disabled || busy ? "opacity-45" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div
        className="absolute inset-y-1 left-1 rounded-full bg-[#65d6ad]/35 transition-[width]"
        style={{ width: `${Math.max(54, fill)}%` }}
      />
      <div
        className="absolute left-1 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#65d6ad] text-[#07100d] shadow-[0_10px_30px_rgba(101,214,173,0.3)] transition-transform"
        style={{ transform: `translateX(${dragX}px)` }}
      >
        {busy ? (
          <Sparkles className="h-5 w-5" aria-hidden />
        ) : (
          <ChevronRight className="h-6 w-6" aria-hidden />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16">
        <span className="truncate text-sm font-semibold text-[#f4f1e8]">
          {busy ? "Evaluando" : label}
        </span>
      </div>
    </div>
  );
}

function LandingVisual({ mode }: { mode: LandingStep["mode"] }) {
  if (mode === "cost") {
    return (
      <div className="grid gap-2">
        {[
          ["Ruido", "Opiniones sin contexto"],
          ["Demora", "Decisiones que se postergan"],
          ["Costo", "Construir sin criterio externo"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3"
          >
            <span className="text-sm font-semibold text-[#f4f1e8]">{label}</span>
            <span className="text-xs text-[#a8b4a5]">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "system") {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#f4f1e8] p-4 text-[#07100d]">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div className="grid gap-2">
            {["1", "2", "3"].map((step) => (
              <span
                key={step}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#07100d] font-mono text-xs text-[#65d6ad]"
              >
                {step}
              </span>
            ))}
          </div>
          <div className="grid gap-2">
            {["Aplicas con evidencia", "Aportas feedback util", "Pides feedback con credito"].map(
              (item) => (
                <div key={item} className="rounded-2xl bg-[#07100d]/8 px-4 py-3">
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "apply") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          ["5", "preguntas"],
          ["100", "score"],
          ["4", "estados"],
          ["1", "revision"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-[24px] border border-[#65d6ad]/18 bg-[#65d6ad]/10 p-4"
          >
            <p className="font-mono text-3xl font-semibold text-[#65d6ad]">
              {value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#c9d2c2]">
              {label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#f4f1e8]">
          En revision
        </span>
        <span className="rounded-full bg-[#65d6ad] px-3 py-1 font-mono text-xs text-[#07100d]">
          builder
        </span>
      </div>
      <div className="space-y-3">
        {[
          ["Proyecto real", "88"],
          ["Evidencia", "76"],
          ["Aporte util", "91"],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-[#dce5d6]">{label}</span>
              <span className="font-mono text-[#f3c969]">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#65d6ad]"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultPanel({ state }: { state: ApplyToQlubState }) {
  if (!state.result) return null;

  const copy = decisionCopy[state.result.decision];

  return (
    <section className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#65d6ad]">
          Resultado
        </p>
        <h1 className="mt-3 text-balance text-[clamp(34px,10vw,44px)] font-semibold leading-[0.96]">
          {copy.label}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#c9d2c2]">{copy.body}</p>
      </div>

      <div className="min-h-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#f4f1e8]">
            Score de entrada
          </span>
          <span className="font-mono text-4xl font-semibold text-[#65d6ad]">
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
        <p className="mt-4 truncate font-mono text-xs uppercase tracking-[0.12em] text-[#f3c969]">
          ID: {state.submissionId}
        </p>
      </div>
    </section>
  );
}

export function ApplicationFunnel() {
  const formRef = useRef<HTMLFormElement>(null);
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
  const totalScreens = landingSteps.length + questionSteps.length + 1;
  const questionIndex = activeIndex - landingSteps.length;
  const activeQuestion = questionSteps[questionIndex];
  const isContactScreen = activeIndex === totalScreens - 1;
  const isLandingScreen = activeIndex < landingSteps.length;
  const isApplyGate = activeIndex === landingSteps.length - 1;
  const formStepIndex = Math.max(0, activeIndex - landingSteps.length + 1);
  const formStepTotal = questionSteps.length + 1;
  const formPercent = Math.round((formStepIndex / formStepTotal) * 100);

  const canAdvance = useMemo(() => {
    if (showResult) return false;
    if (isLandingScreen) return true;
    if (activeQuestion) {
      return validateQuestionAnswer(
        activeQuestion,
        answers[activeQuestion.field],
      ).ok;
    }

    return (
      answers.builderName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())
    );
  }, [activeQuestion, answers, isLandingScreen, showResult]);

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

    if (isLandingScreen) {
      const screen = landingSteps[activeIndex];

      return (
        <section className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3c969]">
              {screen.eyebrow}
            </p>
            <h1 className="mt-3 text-balance text-[clamp(34px,10vw,48px)] font-semibold leading-[0.95]">
              {screen.title}
            </h1>
            <p className="mt-4 text-pretty text-[15px] leading-6 text-[#c9d2c2]">
              {screen.body}
            </p>
          </div>

          <div className="min-h-0 self-center pb-8">
            <LandingVisual mode={screen.mode} />
          </div>
        </section>
      );
    }

    if (activeQuestion) {
      const value = answers[activeQuestion.field];
      const fieldError = state.fieldErrors?.[activeQuestion.field];
      const localValidation = validateQuestionAnswer(activeQuestion, value);
      const helperText = fieldError ?? localValidation.message;

      return (
        <section className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3c969]">
              {activeQuestion.eyebrow}
            </p>
            <h1 className="mt-3 text-balance text-[clamp(30px,9vw,42px)] font-semibold leading-[0.98]">
              {activeQuestion.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#c9d2c2]">
              {activeQuestion.helper}
            </p>
          </div>

          <div className="min-h-0 rounded-[28px] border border-white/10 bg-white/[0.045] p-3">
            <textarea
              id={activeQuestion.field}
              value={value}
              onChange={(event) =>
                updateAnswer(activeQuestion.field, event.target.value)
              }
              placeholder={activeQuestion.placeholder}
              className="h-full min-h-0 w-full resize-none rounded-[22px] border border-white/10 bg-[#07100d] px-4 py-4 text-sm leading-6 text-[#f4f1e8] outline-none placeholder:text-[#657066] focus:border-[#65d6ad]"
            />
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
              <span className={fieldError ? "text-[#f3c969]" : "text-[#a8b4a5]"}>
                {helperText || `${countWords(value)} palabras`}
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
      <section className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3c969]">
            Ultimo paso
          </p>
          <h1 className="mt-3 text-balance text-[clamp(32px,9vw,44px)] font-semibold leading-[0.98]">
            Donde enviamos tu resultado?
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#c9d2c2]">
            El scoring sale al instante. La entrada final queda sujeta a revision manual.
          </p>
        </div>

        <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
          <label className="grid gap-2 text-sm font-semibold text-[#f4f1e8]">
            Nombre
            <input
              value={answers.builderName}
              onChange={(event) =>
                updateAnswer("builderName", event.target.value)
              }
              className="h-12 rounded-2xl border border-white/10 bg-[#07100d] px-4 text-sm text-[#f4f1e8] outline-none placeholder:text-[#657066] focus:border-[#65d6ad]"
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
              className="h-12 rounded-2xl border border-white/10 bg-[#07100d] px-4 text-sm text-[#f4f1e8] outline-none placeholder:text-[#657066] focus:border-[#65d6ad]"
              placeholder="tu@email.com"
            />
          </label>
        </div>

        {state.message && !state.ok ? (
          <p className="text-sm leading-5 text-[#f3c969]">{state.message}</p>
        ) : null}
      </section>
    );
  }

  const swipeLabel = showResult
    ? "Editar respuestas"
    : isContactScreen
      ? "Desliza para enviar"
      : isApplyGate
        ? "Desliza para aplicar"
        : "Desliza para continuar";

  function completeSwipe() {
    if (showResult) {
      setDismissedSubmissionId(state.submissionId);
      setActiveIndex(landingSteps.length);
      return;
    }

    if (isContactScreen) {
      formRef.current?.requestSubmit();
      return;
    }

    goNext();
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[#07100d] text-[#f4f1e8] md:grid md:place-items-center md:bg-[radial-gradient(circle_at_50%_0%,rgba(101,214,173,0.18),transparent_34%),#030705] md:h-dvh">
      <form
        ref={formRef}
        action={formAction}
        className="mx-auto grid h-full w-full max-w-[430px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(101,214,173,0.18),transparent_34%),linear-gradient(160deg,#102018_0%,#07100d_44%,#0f120d_100%)] px-4 pb-3 pt-4 md:max-h-[932px] md:rounded-[34px] md:border md:border-white/10 md:shadow-2xl"
      >
        {orderedFields.map((field) => (
          <input key={field} type="hidden" name={field} value={answers[field]} />
        ))}

        <header className="shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-sm uppercase tracking-[0.18em] text-[#65d6ad]">
                QLUB
              </div>
              <p className="mt-1 text-xs text-[#a8b4a5]">
                {isLandingScreen ? "private builders" : "application form"}
              </p>
            </div>
            {!isLandingScreen ? (
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-xs text-[#dce5d6]">
                {formStepIndex}/{formStepTotal}
              </span>
            ) : null}
          </div>
          {!isLandingScreen ? (
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#65d6ad] transition-all"
                style={{ width: `${formPercent}%` }}
              />
            </div>
          ) : null}
        </header>

        <div className="min-h-0 overflow-hidden py-5">{renderActiveScreen()}</div>

        <footer className="shrink-0 pb-[env(safe-area-inset-bottom)]">
          <div className="mb-3 grid grid-cols-[44px_1fr] gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={activeIndex === 0 && !showResult}
              className="flex h-14 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#f4f1e8] transition enabled:active:scale-95 disabled:opacity-35"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <SwipeControl
              label={swipeLabel}
              disabled={!showResult && !canAdvance}
              busy={isPending}
              onComplete={completeSwipe}
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#a8b4a5]">
            <LockKeyhole className="h-4 w-4 text-[#65d6ad]" aria-hidden />
            <span className="truncate">Acceso privado con revision manual</span>
            <ShieldCheck className="h-4 w-4 text-[#f3c969]" aria-hidden />
          </div>
        </footer>
      </form>
    </main>
  );
}
