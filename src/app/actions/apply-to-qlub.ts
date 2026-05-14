"use server";

import {
  applicationSchema,
  decisionCopy,
  scoreApplication,
  type ApplicationField,
  type ApplicationScore,
} from "@/lib/application";

export type ApplyToQlubState = {
  ok: boolean;
  message: string;
  submissionId?: string;
  result?: ApplicationScore;
  fieldErrors?: Partial<Record<ApplicationField, string>>;
};

function firstError(
  errors: Partial<Record<ApplicationField, string[] | undefined>>,
) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      messages?.[0] ?? "Revisa este campo.",
    ]),
  ) as Partial<Record<ApplicationField, string>>;
}

export async function applyToQlub(
  _prevState: ApplyToQlubState,
  formData: FormData,
): Promise<ApplyToQlubState> {
  const parsed = applicationSchema.safeParse({
    builderName: formData.get("builderName"),
    email: formData.get("email"),
    building: formData.get("building"),
    evidence: formData.get("evidence"),
    feedbackNeed: formData.get("feedbackNeed"),
    feedbackCapacity: formData.get("feedbackCapacity"),
    whyNow: formData.get("whyNow"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Completa la aplicacion con evidencia concreta antes de enviarla.",
      fieldErrors: firstError(parsed.error.flatten().fieldErrors),
    };
  }

  const result = scoreApplication(parsed.data);
  const copy = decisionCopy[result.decision];

  return {
    ok: true,
    message: copy.headline,
    submissionId: crypto.randomUUID(),
    result,
  };
}
