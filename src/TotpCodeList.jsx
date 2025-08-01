import {
  Heading,
  List,
  Badge,
  HStack,
  Text,
  Icon,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { MdAccessTime } from "react-icons/md";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function TotpCodeList({ title, codes, colorPalette }) {
  return (
    <VStack gap={4} align={"center"}>
      <Heading size="lg">{title}</Heading>
      <List.Root variant="plain" gap={3}>
        {codes.map((item, index) => (
          <List.Item key={index} gap={3}>
            <Badge colorPalette={colorPalette} size="md">
              {item.code}
            </Badge>
            <Flex gap={3} flexDirection="row">
              <Icon as={MdAccessTime} color={colorPalette} boxSize={6} />
              <Text fontSize="md" color="gray.600">
                {formatTime(item.start)} - {formatTime(item.end)}
              </Text>
            </Flex>
          </List.Item>
        ))}
      </List.Root>
    </VStack>
  );
}
