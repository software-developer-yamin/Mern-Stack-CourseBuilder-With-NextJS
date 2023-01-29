import { Button, Container, Heading, Input, VStack } from "@chakra-ui/react";
import type { FormEvent } from "react";
import { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Container py="16" h="90vh">
      <form onSubmit={submitHandler}>
        <Heading
          my="16"
          textTransform="uppercase"
          textAlign={["center", "left"]}
        >
          Forget Password
        </Heading>

        <VStack spacing="8">
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc@gmail.com"
            type="email"
            focusBorderColor="yellow.500"
          />

          <Button type="submit" w="full" colorScheme="yellow">
            Send Reset Link
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ForgetPassword;
