import { MessageCircle } from "lucide-react";

const whatsappUrl =
  "https://wa.me/5492241562965?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20sus%20productos";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp"
      title="Hablar por WhatsApp"
      className="group animate-whatsapp-enter text-white transition duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        zIndex: 9999,
        display: "inline-flex",
        width: "3.75rem",
        height: "3.75rem",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        backgroundColor: "#25D366",
        opacity: 1,
        pointerEvents: "auto",
        visibility: "visible",
        boxShadow: "0 14px 34px rgba(2,12,27,0.28)"
      }}
    >
      <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-card transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
        Hablar por WhatsApp
      </span>
    </a>
  );
}
