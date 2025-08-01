import { useState, useEffect } from "react";
import generateTOTPCode from "./generateTOTPCode";

export default function useTOTPTimeline({ secretKey, totpCode }) {
  const [upcomingCodes, setUpcomingCodes] = useState([]);
  const [latestCodes, setLatestCodes] = useState([]);

  useEffect(() => {
    setLatestCodes([]);
    setUpcomingCodes([]);

    if (!totpCode || !secretKey) {
      return;
    }

    const getNext30SecondTimestamp = () => {
      const now = new Date().getTime();
      const secondsSinceEpoch = Math.floor(now / 1000);
      const nextMultiple = Math.ceil((secondsSinceEpoch + 1) / 30) * 30;
      const nextTimestamp = nextMultiple * 1000;
      return nextTimestamp;
    };

    const getLast30SecondTimestamp = () => {
      const now = new Date().getTime();
      const secondsSinceEpoch = Math.floor(now / 1000);
      const lastMultiple = Math.floor(secondsSinceEpoch / 30) * 30;
      const lastTimestamp = lastMultiple * 1000 - 30000;
      return lastTimestamp;
    };

    const nextCodeStart = getNext30SecondTimestamp();
    const lastCodeStart = getLast30SecondTimestamp();

    for (let i = 0; i < 5; i++) {
      const futureTimeStart = new Date(nextCodeStart + i * 30000);
      const pastTimeStart = new Date(lastCodeStart - i * 30000);

      try {
        const { otp } = generateTOTPCode(secretKey, futureTimeStart);
        setUpcomingCodes((prevCodes) => [
          ...prevCodes,
          {
            start: futureTimeStart,
            end: new Date(futureTimeStart.getTime() + 30000),
            code: otp,
          },
        ]);

        const { otp: pastOtp } = generateTOTPCode(secretKey, pastTimeStart);
        setLatestCodes((prevCodes) => [
          ...prevCodes,
          {
            start: pastTimeStart,
            end: new Date(pastTimeStart.getTime() + 30000),
            code: pastOtp,
          },
        ]);
      } catch {
        return;
      }
    }
  }, [totpCode, secretKey]);

  return { upcomingCodes, latestCodes };
}
