import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

const Subscribe = () => {
  const subscribeHandler = async () => {};

  return (
    <Container h="90vh" p="16">
      <Heading my="8" textAlign="center">
        Welcome
      </Heading>

      <VStack boxShadow="lg" alignItems="stretch" borderRadius="lg" spacing="0">
        <Box bg="yellow.400" p="4" css={{ borderRadius: "8px 8px 0 0" }}>
          <Text color="black">Pro Pack - ₹299.00</Text>
        </Box>
        <Box p="4">
          <VStack textAlign="center" px="8" mt="4" spacing="8">
            <Text>Join pro pack and get access to all content.</Text>
            <Heading size="md">₹299 Only</Heading>
          </VStack>

          <Button
            my="8"
            w="full"
            colorScheme="yellow"
            onClick={subscribeHandler}
          >
            Buy Now
          </Button>
        </Box>

        <Box bg="blackAlpha.600" p="4" css={{ borderRadius: "0 0 8px 8px" }}>
          <Heading color="white" textTransform="uppercase" size="sm">
            100% refund at cancellation
          </Heading>

          <Text fontSize="xs" color="white">
            *Terms & Conditions Apply
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Subscribe;
