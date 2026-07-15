"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Car, FileText, Phone, Upload, User, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormField } from "@/components/forms/FormField";
import { ROLE_FORM_FIELDS, VEHICLE_OPTIONS } from "@/lib/forms/form-fields";
import {
  CV_ACCEPT_EXTENSIONS,
  validateCvFile,
  type CvValidationError,
} from "@/lib/forms/cv";
import { leadFormSchema, type LeadFormData } from "@/lib/forms/schema";
import { submitLead } from "@/lib/forms/submitLead";
import { resolveTargetSelection, targetOptionValue, withFallbackTargets, fallbackTargetLabel, pickersFormCityTargets, type HiringTarget, type HiringTargetsResponse } from "@/lib/hiring-targets";
import type { Role } from "@/types/role";
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
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 rounded-xl border-brand-border/80 bg-brand-surface/50 px-4 text-base shadow-sm transition-all focus-visible:border-brand-accent focus-visible:ring-brand-accent/30";

const roleBadgeClass: Record<Role, string> = {
  pickers: "from-brand-accent/30 to-brand-accent/15 text-brand-primary",
  couriers: "from-brand-accent/25 to-brand-accent/10 text-brand-primary",
  support: "from-brand-surface-elevated to-brand-surface text-brand-text",
  "service-rep": "from-brand-surface-elevated to-brand-surface text-brand-text",
  manager: "from-brand-accent/40 to-brand-accent-dark/20 text-brand-primary",
};

type LeadFormProps = {
  role: Role;
  /** Render inside WordPress Elementor form slot (compact, no page-level motion). */
  embedded?: boolean;
};

export function LeadForm({ role, embedded = false }: LeadFormProps) {
  const t = useTranslations("form");
  const tRoles = useTranslations("nav.roles");
  const locale = useLocale();
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [targetsLoading, setTargetsLoading] = useState(true);
  const [targets, setTargets] = useState<HiringTarget[]>([]);
  const [locationType, setLocationType] = useState<"store" | "city">("city");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<CvValidationError | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const fields = ROLE_FORM_FIELDS[role];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      role,
      ageConsent: false,
      privacyConsent: false,
    },
  });

  const vehicle = watch("vehicle");

  useEffect(() => {
    reset({
      role,
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      vehicle: undefined,
      taxRegistered: undefined,
      ageConsent: false,
      privacyConsent: false,
      company: "",
      targetId: undefined,
      storeId: undefined,
    });
    setSelectedTarget("");
    setLocationError(false);
    setCvFile(null);
    setCvError(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
  }, [role, reset]);

  const resetCv = () => {
    setCvFile(null);
    setCvError(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
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
      if (cvInputRef.current) cvInputRef.current.value = "";
      return;
    }
    setCvError(null);
    setCvFile(file);
  };

  useEffect(() => {
    let cancelled = false;
    setTargetsLoading(true);

    // Pickers form always uses the fixed city list from the מלקט דף brief.
    if (role === "pickers") {
      setTargets(pickersFormCityTargets());
      setLocationType("city");
      setTargetsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    fetch(`/api/hiring-targets?role=${encodeURIComponent(role)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HiringTargetsResponse | null) => {
        if (cancelled) return;
        const normalized = withFallbackTargets(
          data ?? { role, targets: [] }
        );
        setTargets(normalized.targets);
        setLocationType(normalized.locationType);
      })
      .catch(() => {
        if (!cancelled) {
          const normalized = withFallbackTargets({ role, targets: [] });
          setTargets(normalized.targets);
          setLocationType(normalized.locationType);
        }
      })
      .finally(() => {
        if (!cancelled) setTargetsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    if (targets.length !== 1 || !targets[0].isFallback || selectedTarget) return;
    const value = targetOptionValue(targets[0]);
    setSelectedTarget(value);
    const resolved = resolveTargetSelection(targets, value);
    if (resolved) {
      setValue("city", resolved.city, { shouldValidate: true });
      setValue("targetId", resolved.targetId);
      setValue("storeId", resolved.storeId);
    }
  }, [targets, selectedTarget, setValue]);

  let fieldDelay = 0.05;

  const onSubmit = async (data: LeadFormData) => {
    setSubmitError(false);
    setLocationError(false);

    if (targets.length > 0 && !selectedTarget) {
      setLocationError(true);
      return;
    }

    const result = await submitLead({ ...data, role }, locale, cvFile);
    if (result.success) {
      setSuccessOpen(true);
      reset({
        role,
        ageConsent: false,
        privacyConsent: false,
        company: "",
      });
      resetCv();
    } else {
      setSubmitError(true);
    }
  };

  const onInvalid = () => {
    const firstInvalid = document.querySelector<HTMLElement>(
      "[aria-invalid='true'], #ageConsent[aria-invalid='true'], #privacyConsent[aria-invalid='true'], [role='alert']"
    );
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const consentHasError = Boolean(errors.ageConsent || errors.privacyConsent);

  const locationLabel =
    locationType === "store" ? t("locationStore") : t("locationCity");
  const anyLocationLabels = {
    anyCity: t("locationAnyCity"),
    anyBranch: t("locationAnyBranch"),
  };

  if (targetsLoading) {
    return (
      <div className="space-y-4 animate-pulse" aria-busy="true">
        <div className="h-10 w-40 rounded-full bg-brand-surface" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-12 rounded-xl bg-brand-surface" />
          <div className="h-12 rounded-xl bg-brand-surface" />
        </div>
        <div className="h-12 rounded-xl bg-brand-surface" />
        <div className="h-12 rounded-xl bg-brand-surface" />
      </div>
    );
  }

  const formClassName = embedded ? "wp-lead-form-fields space-y-4" : "space-y-6";
  const fieldInputClass = embedded
    ? "h-11 rounded-xl border-brand-border/80 bg-white px-3 text-sm shadow-sm transition-all focus-visible:border-brand-accent focus-visible:ring-brand-accent/30"
    : inputClassName;

  const formBody = (
        <form
          key={role}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className={formClassName}
          noValidate
        >
          <input type="hidden" {...register("role")} value={role} />
          <input
            type="text"
            {...register("company")}
            tabIndex={-1}
            autoComplete="off"
            className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          {!embedded ? (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.02 }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 text-sm font-bold",
                roleBadgeClass[role]
              )}
            >
              <User className="size-4 shrink-0" aria-hidden />
              {tRoles(role)}
            </motion.div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="firstName"
              label={t("firstName")}
              error={errors.firstName ? t("validation.firstName") : undefined}
              delay={(fieldDelay += 0.04)}
            >
              <Input
                id="firstName"
                className={fieldInputClass}
                {...register("firstName")}
                aria-invalid={!!errors.firstName}
              />
            </FormField>
            <FormField
              id="lastName"
              label={t("lastName")}
              error={errors.lastName ? t("validation.lastName") : undefined}
              delay={(fieldDelay += 0.04)}
            >
              <Input
                id="lastName"
                className={fieldInputClass}
                {...register("lastName")}
                aria-invalid={!!errors.lastName}
              />
            </FormField>
          </div>

          <FormField
            id="phone"
            label={t("phone")}
            error={errors.phone ? t("validation.phone") : undefined}
            delay={(fieldDelay += 0.04)}
          >
            <div className="relative">
              <Phone
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="phone"
                type="tel"
                dir="ltr"
                className={cn(fieldInputClass, "ps-10")}
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
            </div>
          </FormField>

          <FormField
            id="location"
            label={locationLabel}
            error={locationError ? t("validation.location") : undefined}
            delay={(fieldDelay += 0.04)}
          >
            <select
              id="location"
              className={cn(
                fieldInputClass,
                "w-full appearance-none bg-white pe-10"
              )}
              value={selectedTarget}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTarget(value);
                setLocationError(false);
                const resolved = resolveTargetSelection(targets, value);
                if (resolved) {
                  setValue("city", resolved.city, { shouldValidate: true });
                  setValue("targetId", resolved.targetId);
                  setValue("storeId", resolved.storeId);
                }
              }}
              aria-invalid={locationError}
            >
              {!(targets.length === 1 && targets[0].isFallback) ? (
                <option value="">{t("locationPlaceholder")}</option>
              ) : null}
              {targets.map((target) => {
                const value = targetOptionValue(target);
                return (
                  <option key={value} value={value}>
                    {fallbackTargetLabel(target, locationType, anyLocationLabels)}
                  </option>
                );
              })}
            </select>
          </FormField>

          <FormField
            id="cv"
            label={t("cv")}
            error={
              cvError
                ? t(cvError === "size" ? "validation.cvSize" : "validation.cvType")
                : undefined
            }
            delay={(fieldDelay += 0.04)}
          >
            <div className="space-y-2">
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
                    className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-brand-surface hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                    aria-label={t("cvRemove")}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className={cn(
                    fieldInputClass,
                    "flex w-full cursor-pointer items-center gap-3 text-start text-muted-foreground hover:border-brand-accent/60"
                  )}
                >
                  <Upload className="size-4 shrink-0 text-brand-primary" aria-hidden />
                  <span className="truncate text-sm">{t("cvHint")}</span>
                </button>
              )}
              <input
                id="cv"
                ref={cvInputRef}
                type="file"
                accept={CV_ACCEPT_EXTENSIONS}
                className="sr-only"
                onChange={(e) => handleCvChange(e.target.files?.[0] ?? null)}
                aria-invalid={!!cvError}
              />
            </div>
          </FormField>

          {fields.includes("vehicle") && (
            <input type="hidden" {...register("vehicle")} />
          )}
          {fields.includes("taxRegistered") && (
            <input type="hidden" {...register("taxRegistered")} />
          )}

          {fields.includes("vehicle") && (
            <FormField
              id="vehicle"
              label={t("vehicle")}
              error={errors.vehicle ? t("validation.vehicle") : undefined}
              delay={(fieldDelay += 0.04)}
            >
              <div className="grid grid-cols-3 gap-2">
                {VEHICLE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setValue("vehicle", option, { shouldValidate: true })
                    }
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-all sm:text-sm",
                      vehicle === option
                        ? "border-brand-accent bg-brand-accent/15 text-brand-primary shadow-sm"
                        : "border-brand-border/60 bg-white text-brand-text hover:border-brand-accent/50"
                    )}
                  >
                    {option === "car" ? (
                      <Car className="size-5" aria-hidden />
                    ) : (
                      <Bike className="size-5" aria-hidden />
                    )}
                    {t(`vehicleOptions.${option}`)}
                  </button>
                ))}
              </div>
            </FormField>
          )}

          {fields.includes("taxRegistered") && (
            <FormField
              id="taxRegistered"
              label={t("taxRegistered")}
              error={
                errors.taxRegistered ? t("validation.taxRegistered") : undefined
              }
              delay={(fieldDelay += 0.04)}
            >
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setValue("taxRegistered", value, { shouldValidate: true })
                    }
                    className={cn(
                      "flex-1 cursor-pointer rounded-xl border-2 py-3 text-sm font-semibold transition-all",
                      watch("taxRegistered") === value
                        ? "border-brand-accent bg-brand-accent/15 text-brand-primary shadow-sm"
                        : "border-brand-border/60 bg-white text-brand-text hover:border-brand-accent/50"
                    )}
                  >
                    {t(value === "yes" ? "taxYes" : "taxNo")}
                  </button>
                ))}
              </div>
            </FormField>
          )}

          <motion.div
            className={cn(
              "space-y-4 rounded-2xl bg-brand-surface/60 p-4",
              consentHasError && "ring-2 ring-destructive/40"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: fieldDelay + 0.04 }}
          >
            <div className="flex items-start gap-3">
              <Controller
                name="ageConsent"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="ageConsent"
                    checked={field.value === true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    aria-invalid={!!errors.ageConsent}
                    aria-required="true"
                  />
                )}
              />
              <Label htmlFor="ageConsent" className="leading-relaxed font-normal">
                {t("ageConsent")}
                <span className="ms-1 text-destructive" aria-hidden>
                  *
                </span>
              </Label>
            </div>
            {errors.ageConsent && (
              <p className="text-sm text-destructive" role="alert">
                {t("validation.ageConsent")}
              </p>
            )}

            <div className="flex items-start gap-3">
              <Controller
                name="privacyConsent"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="privacyConsent"
                    checked={field.value === true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    aria-invalid={!!errors.privacyConsent}
                    aria-required="true"
                  />
                )}
              />
              <Label htmlFor="privacyConsent" className="leading-relaxed font-normal">
                {t.rich("privacyConsent", {
                  privacyLink: (chunks) => (
                    <a
                      href={t("privacyUrl")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-brand-primary hover:opacity-80"
                    >
                      {chunks}
                    </a>
                  ),
                })}
                <span className="ms-1 text-destructive" aria-hidden>
                  *
                </span>
              </Label>
            </div>
            {errors.privacyConsent && (
              <p className="text-sm text-destructive" role="alert">
                {t("validation.privacyConsent")}
              </p>
            )}
          </motion.div>

          {submitError && (
            <p className="text-center text-sm text-destructive" role="alert">
              {t("errorSubmit")}
            </p>
          )}

          {embedded ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="wp-lead-form-submit h-12 w-full cursor-pointer rounded-full text-sm font-bold transition-all disabled:opacity-60"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: fieldDelay + 0.08 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full cursor-pointer rounded-full bg-brand-accent text-base font-bold text-brand-primary shadow-volumetric transition-all hover:bg-brand-accent-dark hover:shadow-volumetric-lg disabled:opacity-60"
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </motion.div>
          )}
        </form>
  );

  return (
    <>
      {embedded ? (
        formBody
      ) : (
        <AnimatePresence mode="wait">{formBody}</AnimatePresence>
      )}

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="border-brand-border bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-brand-primary">
              {t("successTitle")}
            </DialogTitle>
            <DialogDescription>{t("successMessage")}</DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setSuccessOpen(false)}
            className="cursor-pointer rounded-full bg-brand-accent text-brand-primary hover:bg-brand-accent-dark"
          >
            {t("close")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
