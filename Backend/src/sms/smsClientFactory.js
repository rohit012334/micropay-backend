import env from "../config/env.js";

function createDummySmsClient() {
  return {
    async sendSms(to, message) {
      console.log(`[SMS dummy] To: ${to}, Message: ${message}`);
      return {};
    },
  };
}

async function createTwilioSmsClient() {
  try {
    const twilio = await import("twilio");
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !fromNumber) {
      console.warn("Twilio: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER required. Using dummy.");
      return createDummySmsClient();
    }
    const client = twilio.default(accountSid, authToken);
    return {
      async sendSms(to, message) {
        await client.messages.create({ body: message, from: fromNumber, to });
        return {};
      },
    };
  } catch (e) {
    console.warn("Twilio not available:", e.message, "- using dummy SMS");
    return createDummySmsClient();
  }
}

async function createAwsSnsClient() {
  try {
    const { SNSClient, PublishCommand } = await import("@aws-sdk/client-sns");
    const region = process.env.AWS_REGION || "ap-south-1";
    const client = new SNSClient({ region });
    return {
      async sendSms(to, message) {
        await client.send(
          new PublishCommand({
            PhoneNumber: to,
            Message: message,
          })
        );
        return {};
      },
    };
  } catch (e) {
    console.warn("AWS SNS not available:", e.message, "- using dummy SMS");
    return createDummySmsClient();
  }
}

let cachedClient = null;

export async function getSmsClient() {
  if (cachedClient) return cachedClient;
  const provider = (env.smsProvider || "dummy").toLowerCase();
  if (provider === "twilio") {
    cachedClient = await createTwilioSmsClient();
  } else if (provider === "aws_sns") {
    cachedClient = await createAwsSnsClient();
  } else {
    cachedClient = createDummySmsClient();
  }
  return cachedClient;
}
