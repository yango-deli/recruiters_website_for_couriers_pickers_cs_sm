"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  withFallbackTargets,
  resolveTargetSelection,
  targetOptionValue,
  type HiringTarget,
  type HiringTargetsResponse,
} from "@/lib/hiring-targets";
import type { WebsiteFormConfig } from "@/lib/jobs/types";
import {
  CV_ACCEPT_EXTENSIONS,
  validateCvFile,
  type CvValidationError,
} from "@/lib/forms/cv";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 rounded-xl border-brand-border/80 bg-brand-surface/50 px-4 text-base shadow-sm transition-all focus-visible:border-brand-accent focus-visible:ring-brand-accent/30";

type DynamicLeadFormProps = {
  positionId: string;
  positionSlug: string;
  formConfig: WebsiteFormConfig;
  locale?: string;
};

export function DynamicLeadForm({
  positionId,
  positionSlug,
  formConfig,
  locale = "he",
}: DynamicLeadFormProps) {
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [targetsLoading, setTargetsLoading] = useState(formConfig.showHiringTargets);
  const [targets, setTargets] = useState<HiringTarget[]>([]);
  const [locationType, setLocationType] = useState<"store" | "city">("city");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<CvValidationError | null>(null);
  // Bumping this key remounts the file input to clear it, so the submit path
  // never reads a ref during render (react-hooks/refs).
  const [cvInputKey, setCvInputKey] = useState(0);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const resetCv = () => {
    setCvFile(null);
    setCvError(null);
    setCvInputKey((k) => k + 1);
  };

  const handleCvChange = (file: File | null) => {
    if (!file) {
      resetCv();
      return;
    }
    const error = validateCvFile(file);
    if (error) {
      setCvError(error);
      setCvFile(null);
      setCvInputKey((k) => k + 1);
      return;
    }
    setCvError(null);
    setCvFile(file);
  };

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {
      company: z.string().max(0).optional(),
    };
    for (const field of formConfig.fields) {
      if (field.type === "phone") {
        shape[field.key] = z.string().trim().min(9).max(20);
      } else if (field.required !== false) {
        shape[field.key] = z.string().trim().min(1);
      } else {
        shape[field.key] = z.string().optional();
      }
    }
    for (const cb of formConfig.consentCheckboxes) {
      if (cb.required) {
        shape[cb.key] = z.boolean().refine((v) => v === true, { message: "required" });
      } else {
        shape[cb.key] = z.boolean().optional();
      }
    }
    return z.object(shape);
  }, [formConfig]);

  type FormValues = z.infer<typeof schema>;

  const defaultValues = useMemo(() => {
    const values: Record<string, unknown> = { company: "" };
    for (const field of formConfig.fields) {
      values[field.key] = "";
    }
    for (const cb of formConfig.consentCheckboxes) {
      values[cb.key] = false;
    }
    return values as FormValues;
  }, [formConfig]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!formConfig.showHiringTargets) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/hiring-targets?role=${encodeURIComponent(positionSlug)}`);
        const raw = (await res.json()) as Partial<HiringTargetsResponse> & { role: string };
        if (cancelled) return;
        const data = withFallbackTargets({ ...raw, role: positionSlug });
        setLocationType(data.locationType ?? "city");
        setTargets(data.targets);
      } catch {
        if (!cancelled) {
          const data = withFallbackTargets({ role: positionSlug, targets: [] });
          setTargets(data.targets);
        }
      } finally {
        if (!cancelled) setTargetsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [formConfig.showHiringTargets, positionSlug]);

  async function onSubmit(values: FormValues) {
    setSubmitError(false);
  setLocationError(false);

    if (formConfig.showHiringTargets && !selectedTarget) {
      setLocationError(true);
      return;
    }

    const consent: Record<string, boolean> = {};
    for (const cb of formConfig.consentCheckboxes) {
      consent[cb.key] = Boolean(values[cb.key as keyof FormValues]);
    }

    const formData: Record<string, string> = {};
    for (const field of formConfig.fields) {
      const v = values[field.key as keyof FormValues];
      if (typeof v === "string") formData[field.key] = v;
    }

    const firstName = formData.firstName ?? "";
    const lastName = formData.lastName ?? "";
    const phone = formData.phone ?? "";

    const target = selectedTarget
      ? resolveTargetSelection(targets, selectedTarget)
      : null;

    const payload: Record<string, unknown> = {
      dynamicJob: true,
      positionId,
      positionSlug,
      firstName,
      lastName,
      phone,
      locale,
      city: formData.city ?? target?.city,
      targetId: target?.targetId,
      storeId: target?.storeId,
      consent,
      formData,
      company: values.company,
    };

    let res: Response;
    if (cvFile) {
      const fd = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;
        fd.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
      fd.append("cv", cvFile);
      res = await fetch("/api/submit-lead", { method: "POST", body: fd });
    } else {
      res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      setSubmitError(true);
      return;
    }

    reset(defaultValues);
    setSelectedTarget("");
    resetCv();
    setSuccessOpen(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("company")} />

        {formConfig.showHiringTargets && (
          <div className="space-y-2">
            <Label htmlFor="job-target">
              {locationType === "store" ? "סניף" : "עיר"}
            </Label>
            <select
              id="job-target"
              className={cn(inputClassName, "w-full")}
              value={selectedTarget}
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                setLocationError(false);
              }}
              disabled={targetsLoading}
            >
              <option value="">
                {targetsLoading ? "…" : locationType === "store" ? "כל הסניפים" : "כל הערים"}
              </option>
              {targets.map((t) => (
                <option key={targetOptionValue(t)} value={targetOptionValue(t)}>
                  {t.label}
                </option>
              ))}
            </select>
            {locationError && (
              <p className="text-sm text-red-600" role="alert">
                נדרש לבחור מיקום
              </p>
            )}
          </div>
        )}

        {formConfig.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
            <Input
              id={`field-${field.key}`}
              type={field.type === "phone" ? "tel" : "text"}
              className={inputClassName}
              {...register(field.key as keyof FormValues & string)}
            />
            {errors[field.key as keyof FormValues] && (
              <p className="text-sm text-red-600" role="alert">
                שדה חובה
              </p>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="cv">קורות חיים (לא חובה)</Label>
          {cvFile ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-border/80 bg-brand-surface/50 px-4 py-3">
              <FileText
                className="size-5 shrink-0 text-brand-primary"
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-brand-text">
                {cvFile.name}
              </span>
              <button
                type="button"
                onClick={resetCv}
                aria-label="הסרת הקובץ"
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-brand-surface hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className={cn(
                inputClassName,
                "flex w-full cursor-pointer items-center gap-3 text-start text-muted-foreground hover:border-brand-accent/60"
              )}
            >
              <Upload className="size-4 shrink-0 text-brand-primary" aria-hidden />
              <span className="truncate text-sm">
                צרפו קובץ PDF, DOC או DOCX (עד 4MB)
              </span>
            </button>
          )}
          <input
            key={cvInputKey}
            id="cv"
            ref={cvInputRef}
            type="file"
            accept={CV_ACCEPT_EXTENSIONS}
            className="sr-only"
            onChange={(e) => handleCvChange(e.target.files?.[0] ?? null)}
            aria-invalid={!!cvError}
          />
          {cvError && (
            <p className="text-sm text-red-600" role="alert">
              {cvError === "size"
                ? "הקובץ גדול מדי (עד 4MB)"
                : "סוג קובץ לא נתמך. העלו PDF, DOC או DOCX"}
            </p>
          )}
        </div>

        {formConfig.consentCheckboxes.map((cb) => (
          <div key={cb.key} className="flex items-start gap-3">
            <Controller
              name={cb.key as keyof FormValues & string}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={`consent-${cb.key}`}
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor={`consent-${cb.key}`}
              className="block min-w-0 flex-1 text-start text-sm leading-snug font-normal"
            >
              {cb.label}
              {cb.required ? " *" : ""}
            </Label>
          </div>
        ))}

        {submitError && (
          <p className="text-sm text-red-600" role="alert">
            שליחה נכשלה. נסו שוב.
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-brand-accent text-brand-primary font-bold hover:bg-brand-accent-dark"
        >
          {isSubmitting ? "שולח…" : "שליחה"}
        </Button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>תודה!</DialogTitle>
            <DialogDescription>קיבלנו את הפנייה ונחזור אליכם בקרוב.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
