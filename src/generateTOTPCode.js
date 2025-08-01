import { TOTP } from "totp-generator";

export default function generateTotpCode(secretKey, timestamp = Date.now()) {
  let totpCode;
  try {
    totpCode = TOTP.generate(secretKey, { timestamp: timestamp });
  } catch (error) {
    throw new Error("Failed to generate TOTP code: " + error.message);
  }

  return totpCode;
}
