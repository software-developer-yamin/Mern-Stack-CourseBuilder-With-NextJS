import { Button, Container, Heading, Input, VStack } from "@chakra-ui/react";
import type { FormEvent } from "react";
import { useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

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
          Reset Password
        </Heading>

        <VStack spacing="8">
          <Input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            type="password"
            focusBorderColor="yellow.500"
          />

          <Button type="submit" w="full" colorScheme="yellow">
            Reset Password
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ResetPassword;
