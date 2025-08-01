import {
  Field,
  Input,
  Text,
  Progress,
  Clipboard,
  IconButton,
  InputGroup,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import useTotp from "./useTotp";

export default function TotpCodeGenerator({
  secretKey,
  setSecretKey,
  setTotpCode,
}) {
  const { totpCode, timeLeft, hasInvalidSecretKey } = useTotp(secretKey);
  const [inputValue, setInputValue] = useState(secretKey);
  const debouncedValue = useDebounce(inputValue, 300)[0];

  useEffect(() => {
    if (debouncedValue !== secretKey) {
      setSecretKey(debouncedValue);
    }
  }, [debouncedValue, secretKey, setSecretKey]);

  useEffect(() => {
    setTotpCode(totpCode);
  }, [totpCode, setTotpCode]);

  return (
    <VStack
      w="100%"
      align="center"
      gap="4"
      bgColor="gray.100"
      borderRadius="md"
    >
      <Heading size="lg">TOTP Code Generator</Heading>

      <Clipboard.Root maxW="150px" value={totpCode}>
        <Clipboard.Label textStyle="label">TOTP Code</Clipboard.Label>
        <InputGroup endElement={<ClipboardIconButton />}>
          <Clipboard.Input asChild>
            <Input />
          </Clipboard.Input>
        </InputGroup>
      </Clipboard.Root>

      {totpCode && (
        <>
          <Text fontSize="sm" color="gray.500">
            New code in: {timeLeft}s
          </Text>
          <Progress.Root
            value={(timeLeft / 30) * 100}
            max={100}
            size="md"
            minW="150px"
            colorPalette={timeLeft < 10 ? "red" : "blue"}
            striped
            animated
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </>
      )}

      <Field.Root maxW="md" invalid={hasInvalidSecretKey}>
        <Field.Label>Secret Key</Field.Label>
        <Input
          placeholder="Enter your secret key"
          size="lg"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          maxLength={32}
        />
        <Field.ErrorText>Invalid Secret Key</Field.ErrorText>
        <Field.HelperText>Never share your secret key.</Field.HelperText>
      </Field.Root>
    </VStack>
  );
}

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="surface" size="xs" me="-2">
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
