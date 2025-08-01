import { TOTP } from "totp-generator";

export default function generateTOTPCode(secretKey, timestamp = Date.now()) {
  let totpCode;
  try {
    totpCode = TOTP.generate(secretKey, { timestamp: timestamp });
  } catch (error) {
    throw new Error("Failed to generate TOTP code: " + error.message);
  }

  return totpCode;
}
