import generateTotpCode from "./generateTotpCode";

export default function checkIfTotpExisted(secretKey, totpCode, days) {
  if (!secretKey || !totpCode || !days) {
    throw new Error("All parameters (secretKey, totpCode, days) are required.");
  }

  const now = Date.now();
  const step = 30000;
  const startTs = now - days * 24 * 60 * 60 * 1000;

  for (let ts = startTs; ts <= now; ts += step) {
    try {
      const { otp, expires } = generateTotpCode(secretKey, ts);
      if (otp === totpCode) {
        const dateObj = new Date(ts);
        const date = dateObj.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const timeStartObj = new Date(expires - 30000);
        const timeStart = timeStartObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const timeEndObj = new Date(expires);
        const timeEnd = timeEndObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return {
          found: true,
          date,
          timeStart,
          timeEnd,
        };
      }
    } catch (error) {
      throw new Error(`Fail to generate TOTP at ${ts}: ${error.message}`);
    }
  }

  return { found: false };
}
