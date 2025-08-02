import { Flex, Separator } from "@chakra-ui/react";
import TotpCodeList from "./TotpCodeList";
import useTotpTimeline from "./useTotpTimeline";

export default function TotpCodeTimeline({ secretKey, totpCode }) {
  const { upcomingCodes, latestCodes } = useTotpTimeline({
    secretKey,
    totpCode,
  });

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="center"
      w="100%"
      gap="6"
    >
      <TotpCodeList title="Latest" codes={latestCodes} colorPalette="orange" />
      <Separator
        orientation={{ base: "horizontal", md: "vertical" }}
        size={{ base: "sm", md: "lg" }}
      />
      <TotpCodeList
        title="Upcoming"
        codes={upcomingCodes}
        colorPalette="blue"
      />
    </Flex>
  );
}
