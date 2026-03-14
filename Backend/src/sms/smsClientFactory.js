import axios from "axios";

function createDummySmsClient() {
  return {
    async sendSms(to, message, options = {}) {
      console.log(`[SMS dummy] To: ${to}, Message: ${message}`);
      return {};
    },
  };
}

function createIcpaasSmsClient() {
  const apiKey = process.env.ICPAAS_API_KEY;
  const senderId = process.env.ICPAAS_SENDER_ID;
  const peId = process.env.ICPAAS_PE_ID;

  if (!apiKey || !senderId || !peId) {
    console.warn("iCPaaS: credentials missing — using dummy SMS");
    return createDummySmsClient();
  }

  return {
    async sendSms(to, message, options = {}) {
      try {
        const response = await axios.post(
          "https://icpaas.in/api/v1/sms/mt",
          {
            senderId,
            peId,
            dltTemplateId: options.dltTemplateId || "",
            text: message,
            numbers: [to],
            dcs: 0,
            flashSms: 0,
            schedTime: "",
            groupId: "",
            chainValue: "",
            messageId: "",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("iCPaaS SMS failed:", error.response?.data || error.message);
        throw error;
      }
    },
  };
}

let cachedClient = null;

export async function getSmsClient() {
  if (cachedClient) return cachedClient;

  const provider = (process.env.SMS_PROVIDER || "dummy").toLowerCase();

  cachedClient = provider === "icpaas"
    ? createIcpaasSmsClient()
    : createDummySmsClient();

  return cachedClient;
}