import {
  BadgeCheck,
  ClipboardCheck,
  Eye,
  MessageSquareText,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export const memberStates = [
  {
    key: "waitlist",
    label: "Waitlist",
    description: "Tiene potencial, pero necesita mostrar mas evidencia.",
  },
  {
    key: "approved_observer",
    label: "Observer",
    description: "Puede ver proyectos y dar feedback antes de publicar.",
  },
  {
    key: "approved_builder",
    label: "Builder",
    description: "Puede publicar proyectos, progreso y pedir feedback.",
  },
  {
    key: "trusted_member",
    label: "Trusted",
    description: "Alta senal: mas visibilidad, invitaciones y perks.",
  },
];

export const planTiers = [
  {
    name: "Free",
    price: "$0",
    promise: "Ver proyectos y dar feedback.",
    features: ["Explorar proyectos", "Dar feedback", "Construir reputacion"],
  },
  {
    name: "Entrepreneur",
    price: "TBD / mes",
    promise: "Publicar proyectos y recibir feedback.",
    features: ["Todo Free", "Hasta N proyectos", "Dar y recibir feedback"],
  },
  {
    name: "Business Man",
    price: "TBD / mes",
    promise: "Mas visibilidad, prioridad y acceso curado.",
    features: ["Todo Entrepreneur", "Feedback prioritario", "Acceso a perks"],
  },
];

export const qualitySignals = [
  {
    icon: Rocket,
    title: "Construye algo real",
    body: "Producto, sistema, prototipo, negocio o validacion activa.",
  },
  {
    icon: ClipboardCheck,
    title: "Trae evidencia",
    body: "Demo, landing, screenshots, usuarios, avances o aprendizajes.",
  },
  {
    icon: MessageSquareText,
    title: "Pide feedback puntual",
    body: "No busca aplausos. Busca decisiones, friccion y claridad.",
  },
  {
    icon: ShieldCheck,
    title: "Aporta antes de pedir",
    body: "El acceso se sostiene con feedback util, no con presencia pasiva.",
  },
];

export const applicationQuestions = [
  "Que estas construyendo y para quien?",
  "Que evidencia puedes mostrar hoy?",
  "Que decision necesitas destrabar con feedback?",
  "Que tipo de feedback puedes dar a otros builders?",
  "Por que QLUB deberia darte acceso ahora?",
];

export const qssSteps = [
  {
    label: "Impacto",
    title: "No necesitas mas ruido. Necesitas builders serios cerca.",
  },
  {
    label: "Filtro",
    title: "La entrada exige evidencia, no storytelling vacio.",
  },
  {
    label: "Loop",
    title: "Das feedback para recibir feedback.",
  },
  {
    label: "Acceso",
    title: "Si pasas, aplicas a una comunidad privada de progreso.",
  },
];

export const statusIcons = [Eye, BadgeCheck, ShieldCheck];
