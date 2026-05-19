const defaultWhatsappPhone = "2241562965";
const defaultWhatsappMessage = "Hola, quiero información sobre sus productos";

export function normalizeWhatsappPhone(phone?: string) {
  const digits = (phone || defaultWhatsappPhone).replace(/\D/g, "");
  if (!digits) return `549${defaultWhatsappPhone}`;
  if (digits.startsWith("549")) return digits;
  if (digits.startsWith("54")) return `549${digits.slice(2)}`;
  return `549${digits}`;
}

export function buildWhatsappUrl(phone?: string, message = defaultWhatsappMessage) {
  if (phone?.startsWith("https://wa.me/") || phone?.startsWith("http://wa.me/")) {
    return phone;
  }

  return `https://wa.me/${normalizeWhatsappPhone(phone)}?text=${encodeURIComponent(message)}`;
}
