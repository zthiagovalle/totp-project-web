import { VStack, Tabs, Heading, Icon, Box, Link, Text } from "@chakra-ui/react";
import { LuClock, LuHistory } from "react-icons/lu";
import { useState } from "react";
import TotpCodeGenerator from "./TotpCodeGenerator";
import TotpCodeTimeline from "./TotpCodeTimeline";
import TotpHistoryChecker from "./TotpHistoryChecker";

function App() {
  const [secretKey, setSecretKey] = useState("");
  const [totpCode, setTotpCode] = useState("");

  return (
    <VStack
      pt={{ base: "4", md: "8" }}
      minH="100vh"
      gap={{ base: "4", md: "8" }}
      align="center"
    >
      <Heading
        size={{ base: "lg", md: "xl" }}
        textAlign="center"
        mb="4"
        color="gray.600"
      >
        TOTP Tools
      </Heading>

      <Tabs.Root
        width={{ base: "95%", md: "80%" }}
        defaultValue="code-generator"
        fitted={true}
        lazyMount={true}
        colorPalette="blue"
        variant="subtle"
        size="lg"
        shadow="md"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="code-generator"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            borderTopRadius="md"
            p="1"
          >
            <Icon as={LuClock} mr="2" boxSize={{ base: 4, md: 5 }} />
            Code Generator
          </Tabs.Trigger>
          <Tabs.Trigger
            value="code-checker"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            borderTopRadius="md"
            p="1"
          >
            <Icon as={LuHistory} mr="2" boxSize={{ base: 4, md: 5 }} />
            History Checker
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="code-generator" p={{ base: "2", md: "4" }}>
          <VStack gap={{ base: "4", md: "8" }}>
            <TotpCodeGenerator
              secretKey={secretKey}
              setSecretKey={setSecretKey}
              setTotpCode={setTotpCode}
            />
            <TotpCodeTimeline secretKey={secretKey} totpCode={totpCode} />
          </VStack>
        </Tabs.Content>
        <Tabs.Content value="code-checker" p={{ base: "2", md: "4" }}>
          <TotpHistoryChecker />
        </Tabs.Content>
      </Tabs.Root>

      <Box
        as="footer"
        mt="auto"
        w="100%"
        py="4"
        bg="gray.100"
        textAlign="center"
        fontSize="sm"
        color="gray.600"
      >
        <Text>
          Built by{" "}
          <Link
            href="https://www.linkedin.com/in/zthiagovalle/"
            target="_blank"
            color="blue.500"
          >
            Thiago Valle
          </Link>
          {". Source on "}
          <Link
            href="https://github.com/seu-repo"
            target="_blank"
            color="blue.500"
          >
            Github.
          </Link>
        </Text>
      </Box>
    </VStack>
  );
}

export default App;
