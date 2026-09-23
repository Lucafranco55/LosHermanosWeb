export type WhatsAppProviderName = "simulation" | "meta";
export type WhatsAppSendStatus = "SIMULATED" | "SENT" | "FAILED";

export type WhatsAppSendMessageInput = {
  to: string;
  message: string;
  customerId?: string;
  zoneId?: string;
};

export type WhatsAppSendTemplateInput = {
  to: string;
  templateName: string;
  languageCode: string;
  components?: unknown[];
};

export type DeliveryReminderTemplateInput = {
  to: string;
  customerName: string;
  deliveryDateLabel: string;
  zoneName: string;
  orderDeadlineLabel: string;
};

export type WhatsAppSendMessageResult = {
  status: WhatsAppSendStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  httpStatus?: number | null;
  metaErrorCode?: string | number | null;
};

export type WhatsAppProviderConfig = {
  provider: WhatsAppProviderName;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  graphApiVersion: string;
  automaticSendEnabled: boolean;
};

export interface WhatsAppProvider {
  sendMessage(input: WhatsAppSendMessageInput): Promise<WhatsAppSendMessageResult>;
  sendTemplate(input: WhatsAppSendTemplateInput): Promise<WhatsAppSendMessageResult>;
}

export const DELIVERY_REMINDER_TEMPLATE_NAME = "aviso_reparto_zona";
export const DELIVERY_REMINDER_TEMPLATE_LANGUAGE = "es_AR";

function normalizeProvider(value: string | undefined): WhatsAppProviderName {
  return value === "meta" ? "meta" : "simulation";
}

export function getWhatsAppProviderConfig(): WhatsAppProviderConfig {
  return {
    provider: normalizeProvider(process.env.WHATSAPP_PROVIDER),
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    graphApiVersion: process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0",
    automaticSendEnabled:
      process.env.WHATSAPP_AUTOMATIC_SEND_ENABLED === "true" ||
      process.env.WHATSAPP_ENABLE_AUTOMATED_SENDS === "true"
  };
}

export function isWhatsAppSimulationMode() {
  return getWhatsAppProviderConfig().provider !== "meta";
}

export function isMetaWhatsAppConfigured() {
  const config = getWhatsAppProviderConfig();

  return Boolean(
    config.phoneNumberId &&
      config.businessAccountId &&
      config.accessToken &&
      config.graphApiVersion
  );
}

export function canUseMetaWhatsAppProvider() {
  const config = getWhatsAppProviderConfig();
  return config.provider === "meta" && isMetaWhatsAppConfigured();
}

export function canUseMetaForAutomaticSends() {
  const config = getWhatsAppProviderConfig();

  // Proxima etapa: decidir entre Coexistence o migracion completa antes de habilitar automatizaciones reales.
  return canUseMetaWhatsAppProvider() && config.automaticSendEnabled;
}

export function normalizeWhatsAppPhone(rawPhone: string) {
  return rawPhone.replace(/[^\d]/g, "");
}

export function isValidWhatsAppPhone(rawPhone: string) {
  const normalized = normalizeWhatsAppPhone(rawPhone);
  return normalized.length >= 8 && normalized.length <= 15;
}

function safeMetaError(payload: any, httpStatus: number) {
  return {
    httpStatus,
    metaErrorCode: payload?.error?.code ?? null,
    errorMessage:
      payload?.error?.message ||
      payload?.error?.error_user_msg ||
      `Meta Cloud API respondio con HTTP ${httpStatus}`
  };
}

export class SimulationWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(
    _input: WhatsAppSendMessageInput
  ): Promise<WhatsAppSendMessageResult> {
    return {
      status: "SIMULATED",
      providerMessageId: null,
      errorMessage: null,
      httpStatus: null,
      metaErrorCode: null
    };
  }

  async sendTemplate(
    _input: WhatsAppSendTemplateInput
  ): Promise<WhatsAppSendMessageResult> {
    return {
      status: "SIMULATED",
      providerMessageId: null,
      errorMessage: null,
      httpStatus: null,
      metaErrorCode: null
    };
  }
}

export class MetaWhatsAppProvider implements WhatsAppProvider {
  constructor(private readonly config = getWhatsAppProviderConfig()) {}

  private get endpoint() {
    return `https://graph.facebook.com/${this.config.graphApiVersion}/${this.config.phoneNumberId}/messages`;
  }

  private validateConfig(): WhatsAppSendMessageResult | null {
    if (!canUseMetaWhatsAppProvider()) {
      return {
        status: "FAILED",
        providerMessageId: null,
        errorMessage:
          "Meta WhatsApp no esta configurado. Revisar WHATSAPP_PROVIDER=meta y credenciales de Meta.",
        httpStatus: null,
        metaErrorCode: null
      };
    }

    return null;
  }

  async sendMessage(
    input: WhatsAppSendMessageInput
  ): Promise<WhatsAppSendMessageResult> {
    const configError = this.validateConfig();
    if (configError) return configError;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normalizeWhatsAppPhone(input.to),
          type: "text",
          text: {
            preview_url: false,
            body: input.message
          }
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          status: "FAILED",
          providerMessageId: null,
          ...safeMetaError(payload, response.status)
        };
      }

      return {
        status: "SENT",
        providerMessageId: payload?.messages?.[0]?.id || null,
        errorMessage: null,
        httpStatus: response.status,
        metaErrorCode: null
      };
    } catch (error) {
      return {
        status: "FAILED",
        providerMessageId: null,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Error desconocido al llamar a Meta Cloud API",
        httpStatus: null,
        metaErrorCode: null
      };
    }
  }

  async sendTemplate(
    input: WhatsAppSendTemplateInput
  ): Promise<WhatsAppSendMessageResult> {
    const configError = this.validateConfig();
    if (configError) return configError;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: normalizeWhatsAppPhone(input.to),
          type: "template",
          template: {
            name: input.templateName,
            language: {
              code: input.languageCode
            },
            components: input.components || []
          }
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          status: "FAILED",
          providerMessageId: null,
          ...safeMetaError(payload, response.status)
        };
      }

      return {
        status: "SENT",
        providerMessageId: payload?.messages?.[0]?.id || null,
        errorMessage: null,
        httpStatus: response.status,
        metaErrorCode: null
      };
    } catch (error) {
      return {
        status: "FAILED",
        providerMessageId: null,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Error desconocido al llamar a Meta Cloud API",
        httpStatus: null,
        metaErrorCode: null
      };
    }
  }
}

export function getWhatsAppProvider() {
  if (!canUseMetaWhatsAppProvider()) {
    return new SimulationWhatsAppProvider();
  }

  return new MetaWhatsAppProvider();
}

export function getMetaWhatsAppProviderForManualTest() {
  return new MetaWhatsAppProvider();
}

export function buildDeliveryReminderTemplateComponents(
  input: DeliveryReminderTemplateInput
) {
  return [
    {
      type: "body",
      parameters: [
        { type: "text", text: input.customerName },
        { type: "text", text: input.deliveryDateLabel },
        { type: "text", text: input.zoneName },
        { type: "text", text: input.orderDeadlineLabel }
      ]
    }
  ];
}

export async function sendDeliveryReminderTemplate(
  input: DeliveryReminderTemplateInput
) {
  return getMetaWhatsAppProviderForManualTest().sendTemplate({
    to: input.to,
    templateName: DELIVERY_REMINDER_TEMPLATE_NAME,
    languageCode: DELIVERY_REMINDER_TEMPLATE_LANGUAGE,
    components: buildDeliveryReminderTemplateComponents(input)
  });
}
