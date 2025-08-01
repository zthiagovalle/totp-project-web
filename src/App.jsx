import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import TotpCodeGenerator from "./TotpCodeGenerator";
import TotpCodeTimeline from "./TotpCodeTimeline";
import TotpHistoryChecker from "./TotpHistoryChecker";

function App() {
  const [secretKey, setSecretKey] = useState("");
  const [totpCode, setTotpCode] = useState("");

  return (
    <VStack
      // spacing="4"
      // align="center"
      // bgGradient="to-br"
      // gradientFrom="white"
      // gradientTo="gray.200"
      p={{ base: "4", md: "8" }}
      minH="100vh"
      gap={{ base: "4", md: "8" }}
    >
      <TotpCodeGenerator
        secretKey={secretKey}
        setSecretKey={setSecretKey}
        setTotpCode={setTotpCode}
      />
      <TotpCodeTimeline secretKey={secretKey} totpCode={totpCode} />
      <TotpHistoryChecker />
    </VStack>
  );
}

export default App;
