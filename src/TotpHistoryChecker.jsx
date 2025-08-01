import {
  Button,
  Flex,
  Field,
  Input,
  Select,
  createListCollection,
  Stack,
  Box,
  Card,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import checkIfTotpExisted from "./checkIfTotpExisted";

export default function TotpHistoryChecker() {
  const period = createListCollection({
    items: [
      { label: "1 day", value: 1 },
      { label: "3 days", value: 3 },
      { label: "5 days", value: 5 },
      { label: "7 days", value: 7 },
    ],
  });

  const [secretKey, setSecretKey] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [result, setResult] = useState(null);
  const [hasInvalidSecretKey, setHasInvalidSecretKey] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);

  const handleSubmit = (e) => {
    setHasInvalidSecretKey(false);
    e.preventDefault();
    setIsInProgress(true);
    try {
      const result = checkIfTotpExisted(secretKey, totpCode, selectedPeriod);
      setResult(result);
    } catch (error) {
      console.error("Error checking TOTP history:", error);
      setHasInvalidSecretKey(true);
      return;
    } finally {
      setIsInProgress(false);
    }
  };

  return (
    <Flex
      w="100%"
      bgColor="gray.100"
      borderRadius="md"
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      gap={{ base: "4", md: "10" }}
    >
      <form w="100%" onSubmit={handleSubmit}>
        <Flex bgColor="gray.100" gap="6" direction={"column"} w="100%">
          <Field.Root
            maxW="sm"
            required={true}
            invalid={hasInvalidSecretKey}
            disabled={isInProgress}
          >
            <Field.Label>Secret Key</Field.Label>
            <Input
              name="secretKey"
              placeholder="Enter your secret key"
              size="lg"
              maxLength={32}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <Field.ErrorText>Invalid Secret Key</Field.ErrorText>
          </Field.Root>

          <Field.Root maxW="200px" required={true} disabled={isInProgress}>
            <Field.Label>TOTP Code</Field.Label>
            <Input
              name="totpCode"
              placeholder="Enter your totp code"
              size="lg"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />
          </Field.Root>

          <Field.Root maxW="100px" required={true} disabled={isInProgress}>
            <Field.Label>Period (Days)</Field.Label>
            <Select.Root
              defaultValue={[1]}
              collection={period}
              value={[selectedPeriod]}
              onValueChange={(details) => {
                setSelectedPeriod(details.value[0]);
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select period" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                {" "}
                <Select.Content>
                  {period.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>

          <Button
            type="submit"
            colorPalette="blue"
            variant="subtle"
            loading={isInProgress}
            size="xl"
            w="sm"
          >
            Check
          </Button>
        </Flex>
      </form>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Result</Heading>
        </Card.Header>
        <Card.Body>
          Found on {result?.date ? result.date : "DD/MM/YYYY"} <br />
          valid from {result?.timeStart
            ? result?.timeStart
            : "HH:MM:SS"} to {result?.timeEnd ? result?.timeEnd : "HH:MM:SS"}
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
