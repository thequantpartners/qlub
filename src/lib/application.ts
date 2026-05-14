import { z } from "zod";

export const applicationSchema = z.object({
  builderName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  building: z.string().trim().min(40).max(1200),
  evidence: z.string().trim().min(20).max(1200),
  feedbackNeed: z.string().trim().min(20).max(800),
  feedbackCapacity: z.string().trim().min(20).max(800),
  whyNow: z.string().trim().min(20).max(800),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationField = keyof ApplicationInput;

export type ApplicationDecision =
  | "rejected"
  | "waitlist"
  | "approved_observer"
  | "approved_builder";

export type ScoreBreakdown = {
  label: string;
  score: number;
  max: number;
};

export type ApplicationScore = {
  score: number;
  decision: ApplicationDecision;
  breakdown: ScoreBreakdown[];
  strengths: string[];
  gaps: string[];
};

export const decisionCopy: Record<
  ApplicationDecision,
  { label: string; headline: string; body: string }
> = {
  rejected: {
    label: "No califica todavia",
    headline: "Necesitamos mas evidencia antes de abrir acceso.",
    body: "La aplicacion muestra intencion, pero todavia no prueba suficiente progreso o capacidad de aportar feedback util.",
  },
  waitlist: {
    label: "Waitlist",
    headline: "Hay senal, pero falta precision para entrar ahora.",
    body: "La aplicacion queda como candidata. Mejora evidencia, pedido de feedback y aporte a otros builders.",
  },
  approved_observer: {
    label: "Observer",
    headline: "Puede entrar primero a observar y aportar feedback.",
    body: "La senal es suficiente para participar con acceso limitado antes de publicar proyectos propios.",
  },
  approved_builder: {
    label: "Builder",
    headline: "Califica como builder para la siguiente revision.",
    body: "La aplicacion muestra proyecto real, evidencia y reciprocidad. El siguiente paso es revision manual.",
  },
};

const evidenceMarkers = [
  "demo",
  "url",
  "github",
  "landing",
  "screenshot",
  "usuarios",
  "clientes",
  "ventas",
  "mrr",
  "prototipo",
  "beta",
  "metric",
  "factura",
  "waitlist",
];

const feedbackMarkers = [
  "conversion",
  "copy",
  "ux",
  "pricing",
  "ventas",
  "retencion",
  "onboarding",
  "codigo",
  "producto",
  "operacion",
];

function textScore(value: string, thresholds: [number, number, number]) {
  const length = value.trim().length;

  if (length >= thresholds[2]) return 1;
  if (length >= thresholds[1]) return 0.72;
  if (length >= thresholds[0]) return 0.45;
  return 0.2;
}

function markerScore(value: string, markers: string[]) {
  const normalized = value.toLowerCase();
  const matches = markers.filter((marker) => normalized.includes(marker)).length;

  return Math.min(matches, 4) / 4;
}

function clampScore(value: number, max: number) {
  return Math.min(max, Math.max(0, Math.round(value)));
}

export function scoreApplication(input: ApplicationInput): ApplicationScore {
  const building = clampScore(textScore(input.building, [40, 90, 150]) * 24, 24);
  const evidence = clampScore(
    textScore(input.evidence, [20, 70, 130]) * 18 +
      markerScore(input.evidence, evidenceMarkers) * 12,
    30,
  );
  const feedbackNeed = clampScore(
    textScore(input.feedbackNeed, [20, 60, 110]) * 16 +
      markerScore(input.feedbackNeed, feedbackMarkers) * 6,
    22,
  );
  const reciprocity = clampScore(
    textScore(input.feedbackCapacity, [20, 70, 130]) * 16 +
      markerScore(input.feedbackCapacity, feedbackMarkers) * 8,
    24,
  );
  const timing = clampScore(textScore(input.whyNow, [20, 60, 100]) * 20, 20);

  const breakdown = [
    { label: "Proyecto real", score: building, max: 24 },
    { label: "Evidencia", score: evidence, max: 30 },
    { label: "Pedido claro", score: feedbackNeed, max: 22 },
    { label: "Reciprocidad", score: reciprocity, max: 24 },
    { label: "Momento", score: timing, max: 20 },
  ];

  const rawScore = breakdown.reduce((total, item) => total + item.score, 0);
  const score = clampScore((rawScore / 120) * 100, 100);

  const decision: ApplicationDecision =
    score >= 84
      ? "approved_builder"
      : score >= 68
        ? "approved_observer"
        : score >= 48
          ? "waitlist"
          : "rejected";

  const strengths = [
    building >= 18 ? "Proyecto suficientemente especifico" : "",
    evidence >= 22 ? "Evidencia concreta de avance" : "",
    reciprocity >= 18 ? "Puede aportar feedback util a otros" : "",
    feedbackNeed >= 16 ? "Sabe que decision quiere destrabar" : "",
  ].filter(Boolean);

  const gaps = [
    building < 18 ? "Explica con mas precision que estas construyendo y para quien." : "",
    evidence < 22 ? "Agrega pruebas concretas: demo, usuarios, ventas, screenshots o links." : "",
    feedbackNeed < 16 ? "Define una decision puntual que quieras destrabar con feedback." : "",
    reciprocity < 18 ? "Aclara en que temas puedes ayudar a otros builders." : "",
  ].filter(Boolean);

  return {
    score,
    decision,
    breakdown,
    strengths: strengths.length ? strengths : ["Hay intencion de construir y participar."],
    gaps: gaps.length ? gaps : ["Mantener evidencia actualizada antes de la revision manual."],
  };
}
