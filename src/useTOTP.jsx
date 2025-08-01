import { useState, useEffect, useCallback } from "react";
import generateTotpCode from "./generateTotpCode";

export default function useTotp(secretKey) {
  const [totpCode, setTotpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasInvalidSecretKey, setHasInvalidSecretKey] = useState(false);

  const generateCode = useCallback(() => {
    if (!secretKey) return;

    try {
      const { otp, expires } = generateTotpCode(secretKey);
      setTotpCode(otp);
      setHasInvalidSecretKey(false);

      const initialTimeLeft = Math.ceil((expires - Date.now()) / 1000);
      setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 30);
    } catch (error) {
      console.error("Error generating TOTP code:", error);
      setTotpCode("");
      setTimeLeft(0);
      setHasInvalidSecretKey(true);
    }
  }, [secretKey]);

  useEffect(() => {
    setHasInvalidSecretKey(false);
  }, [secretKey]);

  useEffect(() => {
    if (!secretKey || hasInvalidSecretKey) {
      setTimeLeft(0);
      setTotpCode("");
      return;
    }

    generateCode();

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1 && !hasInvalidSecretKey) {
          generateCode();
          return 30;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secretKey, generateCode, hasInvalidSecretKey]);

  return { totpCode, timeLeft, hasInvalidSecretKey };
}
