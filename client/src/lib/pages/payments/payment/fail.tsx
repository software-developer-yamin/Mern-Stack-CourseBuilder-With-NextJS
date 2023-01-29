import { Button, Container, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";

const PaymentFail = () => {
  return (
    <Container h="90vh">
      <VStack justifyContent="center" h="full" spacing="4">
        <RiErrorWarningFill size="5rem" />
        <Heading textTransform="uppercase">Payment Fail</Heading>
        <Link href="/subscribe">
          <Button variant="ghost">Try Again</Button>
        </Link>
      </VStack>
    </Container>
  );
};

export default PaymentFail;
