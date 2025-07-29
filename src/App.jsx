import {
  Field,
  Input,
  VStack,
  Text,
  Progress,
  Clipboard,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TOTP } from "totp-generator";

function normalizeSecret(secret) {
  return secret.replace(/ /g, "").toUpperCase();
}

function App() {
  const [secret, setSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [expiresAt, setExpiresAt] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const resetTOTP = () => {
      setTotpCode("");
      setTimeLeft(30);
      setHasError(false);
      setExpiresAt(null);
    };

    if (!secret) {
      resetTOTP();
      return;
    }

    const resetTOTPWithError = () => {
      resetTOTP();
      setHasError(true);
    };

    const generateTOTP = () => {
      try {
        const { otp, expires } = TOTP.generate(normalizeSecret(secret));
        setHasError(false);
        setTotpCode(otp);
        setExpiresAt(expires);
        setTimeLeft(Math.ceil((expires - Date.now()) / 1000));
        return true;
      } catch {
        resetTOTPWithError();
        return false;
      }
    };

    const success = generateTOTP();
    if (!success) return;

    const interval = setInterval(() => {
      if (!secret || hasError || !expiresAt) {
        return;
      }

      if (expiresAt < Date.now()) {
        generateTOTP();
        return;
      }
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secret, expiresAt, hasError]);

  return (
    <VStack m="10" spacing="4" align="center">
      <Clipboard.Root w="150px" value={totpCode}>
        <Clipboard.Label textStyle="label">Código TOTP</Clipboard.Label>
        <InputGroup endElement={<ClipboardIconButton />}>
          <Clipboard.Input asChild>
            <Input />
          </Clipboard.Input>
        </InputGroup>
      </Clipboard.Root>

      {totpCode && (
        <>
          <Text fontSize="sm" color="gray.500">
            Novo código em: {timeLeft}s
          </Text>
          <Progress.Root
            value={(timeLeft / 30) * 100}
            max={100}
            size="md"
            w="150px"
            colorPalette={timeLeft < 10 ? "red" : "blue"}
            animated
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </>
      )}

      {hasError && (
        <Text fontSize="sm" color="red.500">
          Secret Key inválida
        </Text>
      )}

      <Field.Root maxW="md" p="4">
        <Field.Label>Secret Key</Field.Label>
        <Input
          placeholder="Digite aqui sua secret key"
          size="lg"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          maxLength={32}
        />
        <Field.HelperText>Nunca compartilhe sua secret key.</Field.HelperText>
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

export default App;
