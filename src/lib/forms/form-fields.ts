import type { Role } from "@/types/role";

export type FormFieldKey =
  | "firstName"
  | "lastName"
  | "phone"
  | "city"
  | "vehicle"
  | "taxRegistered";

export const ROLE_FORM_FIELDS: Record<Role, FormFieldKey[]> = {
  pickers: ["firstName", "lastName", "phone", "city"],
  couriers: ["firstName", "lastName", "phone", "city", "vehicle", "taxRegistered"],
  support: ["firstName", "lastName", "phone", "city"],
  "service-rep": ["firstName", "lastName", "phone", "city"],
  manager: ["firstName", "lastName", "phone", "city"],
};

export const VEHICLE_OPTIONS = ["ebike", "scooter", "car"] as const;
export type VehicleOption = (typeof VEHICLE_OPTIONS)[number];
