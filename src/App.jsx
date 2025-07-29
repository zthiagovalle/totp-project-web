import {
  Field,
  Input,
  VStack,
  Text,
  Progress,
  Clipboard,
  IconButton,
  InputGroup,
  Heading,
  List,
  Badge,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { MdAccessTime } from "react-icons/md";
import { useState, useEffect } from "react";
import { TOTP } from "totp-generator";

function normalizeSecret(secret) {
  return secret.replace(/ /g, "").toUpperCase();
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function App() {
  const [secret, setSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [expiresAt, setExpiresAt] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const resetTOTP = () => {
      setTotpCode("");
      setTimeLeft(30);
      setHasError(false);
      setExpiresAt(null);
      setHistory([]);
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
        const startTime = expiresAt - 30 * 1000;
        setHistory((prev) =>
          [...prev, { code: totpCode, start: startTime, end: expiresAt }].slice(
            -5
          )
        );

        generateTOTP();
        return;
      }
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secret, expiresAt, hasError]);

  return (
    <VStack
      p="36"
      spacing="4"
      align="center"
      bgGradient="to-br"
      gradientFrom="white"
      gradientTo="gray.200"
      minH="100vh"
    >
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
          onChange={(e) => {
            setSecret(e.target.value);
            setHistory([]);
          }}
          maxLength={32}
        />
        <Field.HelperText>Nunca compartilhe sua secret key.</Field.HelperText>
      </Field.Root>

      <Heading size="lg">Últimos</Heading>

      <List.Root variant="plain" gap={3}>
        {history
          .slice()
          .reverse()
          .map((item, index) => (
            <List.Item key={index} gap={3}>
              <Badge colorPalette="green" size="md">
                {item.code}
              </Badge>

              <HStack gap={1}>
                <Text fontSize="md" color="gray.600">
                  {formatTime(item.start)} - {formatTime(item.end)}
                </Text>
                <Icon as={MdAccessTime} color="blue.500" boxSize={6} />
              </HStack>
            </List.Item>
          ))}
      </List.Root>
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
