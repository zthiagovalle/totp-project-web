import { Flex } from "@chakra-ui/react";
import TotpCodeList from "./TotpCodeList";
import useTOTPTimeline from "./useTOTPTimeline";

export default function TotpCodeTimeline({ secretKey, totpCode }) {
  const { upcomingCodes, latestCodes } = useTOTPTimeline({
    secretKey,
    totpCode,
  });

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-around"
      w="100%"
      gap="6"
      bgColor="gray.100"
      borderRadius="md"
    >
      <TotpCodeList title="Latest" codes={latestCodes} colorPalette="orange" />
      <TotpCodeList
        title="Upcoming"
        codes={upcomingCodes}
        colorPalette="blue"
      />
    </Flex>
  );
}
