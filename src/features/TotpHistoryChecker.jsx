import {
  Alert,
  Button,
  Field,
  Input,
  Select,
  createListCollection,
  VStack,
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
    } catch {
      setHasInvalidSecretKey(true);
      return;
    } finally {
      setIsInProgress(false);
    }
  };

  const handleTotpCodeInput = (e) => {
    const totpCodeValue = e.target.value.replace(/\D+/, "");
    setTotpCode(totpCodeValue);
  };

  return (
    <VStack gap="4" w="100%">
      <form onSubmit={handleSubmit}>
        <VStack gap="4" w="100%">
          <Field.Root
            w={{ base: "200px", md: "md" }}
            maxW="md"
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

          <Field.Root
            maxW="md"
            w={{ base: "200px", md: "md" }}
            required={true}
            disabled={isInProgress}
          >
            <Field.Label>TOTP Code</Field.Label>
            <Input
              name="totpCode"
              placeholder="Enter your totp code"
              size="lg"
              maxLength={6}
              value={totpCode}
              onChange={handleTotpCodeInput}
            />
          </Field.Root>

          <Field.Root
            maxW="md"
            required={true}
            disabled={isInProgress}
            w={{ base: "200px", md: "md" }}
          >
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
            loading={isInProgress}
            size="lg"
            maxW="md"
            w={{ base: "200px", md: "md" }}
          >
            Check
          </Button>
        </VStack>
      </form>

      <Alert.Root
        status={result ? (result?.found ? "success" : "error") : "info"}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="auto"
        maxW="md"
      >
        <Alert.Indicator boxSize="40px" mb="2" />
        <Alert.Title mb="1" fontSize="lg">
          Result
        </Alert.Title>
        <Alert.Description maxWidth="sm">
          {result ? (
            result.found ? (
              <>
                Found on {result.date} <br />
                valid from {result.timeStart} to {result.timeEnd}
              </>
            ) : (
              "Not found in the period."
            )
          ) : (
            "Submit to check."
          )}
        </Alert.Description>
      </Alert.Root>
    </VStack>
  );
}
