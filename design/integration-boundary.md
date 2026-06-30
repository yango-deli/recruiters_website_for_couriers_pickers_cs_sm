# Integration boundary — do not change logic

Visual-only rebuild around these frozen modules:

## Forms

- `src/components/forms/LeadForm.tsx` — props: `role`, `embedded`; submit class `wp-lead-form-submit`
- `src/components/forms/FormField.tsx`
- `src/lib/forms/schema.ts`
- `src/lib/forms/form-fields.ts`
- `src/lib/forms/submitLead.ts`

## API

- `src/app/api/submit-lead/route.ts`
- `src/app/api/hiring-targets/route.ts`

## Integrations

- `src/lib/crm.ts`, `src/lib/crm-config.ts`
- `src/lib/telegram.ts`, `src/lib/telegram-config.ts`
- `src/lib/lead-message.ts`
- `src/lib/hiring-targets.ts`

## Allowed presentation changes

- CSS under `.careers-form-section .wp-lead-form*`
- `embedded={true}` on `LeadForm` in `FormSection`
- No field renames, no API payload changes, no validation changes
