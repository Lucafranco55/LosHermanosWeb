import { DeliveryWeekday } from "@prisma/client";

export const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

export const weekdayOptions: Array<{ value: DeliveryWeekday; label: string }> = [
  { value: DeliveryWeekday.MONDAY, label: "Lunes" },
  { value: DeliveryWeekday.TUESDAY, label: "Martes" },
  { value: DeliveryWeekday.WEDNESDAY, label: "Miercoles" },
  { value: DeliveryWeekday.THURSDAY, label: "Jueves" },
  { value: DeliveryWeekday.FRIDAY, label: "Viernes" },
  { value: DeliveryWeekday.SATURDAY, label: "Sabado" },
  { value: DeliveryWeekday.SUNDAY, label: "Domingo" }
];

const weekdayIndex: Record<DeliveryWeekday, number> = {
  [DeliveryWeekday.SUNDAY]: 0,
  [DeliveryWeekday.MONDAY]: 1,
  [DeliveryWeekday.TUESDAY]: 2,
  [DeliveryWeekday.WEDNESDAY]: 3,
  [DeliveryWeekday.THURSDAY]: 4,
  [DeliveryWeekday.FRIDAY]: 5,
  [DeliveryWeekday.SATURDAY]: 6
};

const weekdayByIndex = Object.fromEntries(
  Object.entries(weekdayIndex).map(([weekday, index]) => [index, weekday])
) as Record<number, DeliveryWeekday>;

export function weekdayLabel(weekday?: DeliveryWeekday | null) {
  if (!weekday) return "A definir";
  return weekdayOptions.find((item) => item.value === weekday)?.label || weekday;
}

export function getArgentinaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function dateFromArgentinaDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0, 0));
}

export function dateKeyFromDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const date = dateFromArgentinaDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKeyFromDate(date);
}

export function getWeekdayForDateKey(dateKey: string) {
  return weekdayByIndex[dateFromArgentinaDateKey(dateKey).getUTCDay()];
}

export function formatArgentinaDate(date: Date) {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    timeZone: ARGENTINA_TIME_ZONE,
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatArgentinaDateKey(dateKey: string) {
  return formatArgentinaDate(dateFromArgentinaDateKey(dateKey));
}

export function formatOrderDeadline(weekday: DeliveryWeekday | null | undefined, time: string) {
  const label = weekdayLabel(weekday);
  return `${label} ${time}`;
}

export function getNextReminderPlanForZone(
  zone: { deliveryWeekday: DeliveryWeekday; noticeAdvanceDays: number },
  baseDate = new Date()
) {
  const todayKey = getArgentinaDateKey(baseDate);

  for (let offset = 0; offset <= 21; offset += 1) {
    const deliveryDateKey = addDaysToDateKey(todayKey, offset);
    if (getWeekdayForDateKey(deliveryDateKey) !== zone.deliveryWeekday) continue;

    const scheduledDateKey = addDaysToDateKey(deliveryDateKey, -zone.noticeAdvanceDays);
    if (scheduledDateKey >= todayKey) {
      return {
        deliveryDateKey,
        scheduledDateKey,
        deliveryDate: dateFromArgentinaDateKey(deliveryDateKey),
        scheduledFor: dateFromArgentinaDateKey(scheduledDateKey)
      };
    }
  }

  return null;
}

export function getDueReminderPlanForZone(
  zone: { deliveryWeekday: DeliveryWeekday; noticeAdvanceDays: number },
  baseDate = new Date()
) {
  const todayKey = getArgentinaDateKey(baseDate);

  for (let offset = 0; offset <= 21; offset += 1) {
    const deliveryDateKey = addDaysToDateKey(todayKey, offset);
    if (getWeekdayForDateKey(deliveryDateKey) !== zone.deliveryWeekday) continue;

    const scheduledDateKey = addDaysToDateKey(deliveryDateKey, -zone.noticeAdvanceDays);
    if (scheduledDateKey === todayKey) {
      return {
        deliveryDateKey,
        scheduledDateKey,
        deliveryDate: dateFromArgentinaDateKey(deliveryDateKey),
        scheduledFor: dateFromArgentinaDateKey(scheduledDateKey)
      };
    }
  }

  return null;
}
