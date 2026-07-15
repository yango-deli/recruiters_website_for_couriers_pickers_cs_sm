import type { LeadFormData } from "@/lib/forms/schema";
import { formatTelegramFieldLines } from "@/lib/telegram";
import type { Role } from "@/types/role";

const ROLE_LABELS: Record<Role, string> = {
  couriers: "Курьеры",
  pickers: "Сборщики",
  support: "Поддержка",
  "service-rep": "Оператор поддержки",
  manager: "Менеджер смены",
};

const VEHICLE_LABELS: Record<string, string> = {
  ebike: "E-Bike",
  scooter: "Скутер",
  car: "Авто",
};

export function leadToTelegramFields(
  data: LeadFormData,
  locale?: string
): Record<string, string> {
  const fields: Record<string, string> = {
    Имя: data.firstName,
    Фамилия: data.lastName,
    Телефон: data.phone,
    Город: data.city,
  };

  if ("vehicle" in data && data.vehicle) {
    fields["Транспорт"] = VEHICLE_LABELS[data.vehicle] ?? data.vehicle;
  }
  if ("taxRegistered" in data && data.taxRegistered) {
    fields["Тик в налоговой"] = data.taxRegistered === "yes" ? "Да" : "Нет";
  }
  if (locale) {
    fields["Язык"] = locale;
  }

  return fields;
}

export function formatLeadTelegramMessage(
  data: LeadFormData,
  locale?: string
): string {
  const roleLabel = ROLE_LABELS[data.role];
  const timestamp = new Date().toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
  const fieldLines = formatTelegramFieldLines(leadToTelegramFields(data, locale));

  return [
    "🆕 <b>Новая заявка — Yango Deli</b>",
    `<b>Роль:</b> ${roleLabel} (${data.role})`,
    `<b>Дата:</b> ${timestamp}`,
    "",
    fieldLines,
  ].join("\n");
}
